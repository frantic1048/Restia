---
title: 在 LilyPond 乐谱中插入有动态的 Ghost Note
date: 2022-09-07
tags: [LilyPond, Drum score, 鼓，乐谱]
category: Music
---

在[一开始用 LilyPond 打谱的时候](/p/2021-07-write-drum-score-with-lilypond-on-arch/#鬼音ghost-note)，学到的插入 [ghost note](https://en.wikipedia.org/wiki/Ghost_note#Percussion 'Percussion') 的方式是使用 `\parenthesize` 来给音符弄个括号，这样生成的乐谱阅读上没有什么问题，但是生成的音频听起来的话，音符加 `\parenthesize` 前后声音完全没有区别，试听乐谱的时候不太方便。搜了一圈 [2019 年也有人遇到同样问题](https://www.mail-archive.com/lilypond-user@gnu.org/msg136156.html 'percussion midi accented and ghost notes')，但是看起来没有后续。

目标上来说希望有个神奇命令能搓出一个「真」的 ghost note：让单个音符生成的乐谱和 `\parenthesize` 效果一样，同时生成的音频里音量能比普通音符小一些。

先来波折腾结果示例，两个小节里的 ghost note（那些带括号的音符）分别由 LilyPond 的 `\parenthesize` 和本文介绍的自定义函数生成。

![ghost-note-comparison](../static/lilypond/ghost-note/ghost-note.cropped.svg)  
`audio: ../static/lilypond/ghost-note/ghost-note.m4a`  
[ghost-note.ly](../static/lilypond/ghost-note/ghost-note.ly)

# 过程

文档翻啊翻，找到 [`midi-extra-velocity`](https://lilypond.org/doc/v2.23/Documentation/internals/music-properties) 这个影响音符音量，但是又不会像强弱记号那样影响后续乐谱音量的属性，加上现成的 `\parenthesize` 加个括号，搓一个函数：

```lilypond
ghosta = #(define-scheme-function
           (note)
           (ly:music?)
           (displayMusic note)
           (ly:music-set-property! note 'midi-extra-velocity -50) ;; 减小音量
           (displayMusic note)
           #{
             < \parenthesize #note >
           #}
           )

% 乐谱里用 `\ghosta sn4` 这样的方式调用
```

`define-scheme-function` 用法参见 [2.2.1 Scheme function definitions](https://lilypond.org/doc/v2.22/Documentation/extending/scheme-function-definitions '2.2.1 Scheme function definitions')。第三个参数开始的所有内容会被依次求值，最后一个部分会作为函数的返回值。

[`displayMusic`](http://lilypond.org/doc/v2.22/Documentation/extending/displaying-music-expressions) 是 LilyPond 提供的检查音符（音乐）内容的函数，它能把音符在 LilyPond 内部的表示形式给显示出来（默认显示在 lilypond 的命令行输出里），一般会看到的是一串更低级的 LilyPond 函数的调用，调试 Scheme 函数的时候很有用。

对于刚刚实现的那个函数，写一个 `\ghosta sn4`，函数里两个 `displayMusic` 会给出下面的信息（为了方便阅读，下面内容有手动排版和加注释，不影响含义）：

```scheme
;; 修改之前的音符
(make-music 'NoteEvent
  'drum-type 'snare
  'duration (ly:make-duration 2))

;; 修改之后的音符
(make-music 'NoteEvent
  'midi-extra-velocity -50
  'drum-type 'snare
  'duration (ly:make-duration 2))
```

可以看到预期的属性被设置上去了，接下来检查乐谱，括号显示没啥问题，然后是音频，发现音符的音量并没有什么变化，这不太对劲。

接着翻着翻到了源代码，发现 `midi-extra-velocity` 看起来只有[在音符的 `articulations` 属性里面的元素上才有机会被用上](https://github.com/lilypond/lilypond/blob/259cdc9705763eca2f944ab71ce8e662bffaa057/lily/drum-note-performer.cc#L67-L92)。[LilyPond - Internal Reference 对 `articulations` 属性的描述是](https://lilypond.org/doc/v2.23/Documentation/internals/music-properties)：

> `articulations` (list of music objects)
>
> Articulation events specifically for this note.

直接在音符的属性上修改属性看起来不太行了，那就照它说的搓一个设定了`midi-extra-velocity` 属性的 [`ArticulationEvent`](https://lilypond.org/doc/v2.23/Documentation/internals/articulationevent)。用来生成 `ArticulationEvent` 的内置函数 [`make-articulation` 需要一个额外的 `name` 参数](https://github.com/lilypond/lilypond/blob/259cdc9705763eca2f944ab71ce8e662bffaa057/scm/music-functions.scm#L729)， ~~为了避免更多的奇奇怪怪错误，~~ 尝试用了 LilyPond 已有的 `accent` 这个用于重音的 articulation 名。

```lilypond
ghostb = #(define-scheme-function
           (note)
           (ly:music?)
           #{
             < \parenthesize #note #(make-articulation "accent" 'midi-extra-velocity -50) >
           #}
           )

% 乐谱里用 `\ghostb sn4` 这样的方式调用
```

这下声音调整成功了，但是音符多了个重音记号，这个还好，能用 [`\omit`](https://lilypond.org/doc/v2.23/Documentation/notation/visibility-of-objects#removing-the-stencil '5.4.7 Visibility of objects#Removing the stencil') 去掉。

# TL;DR

于是生成 ghost note 的能用的函数终于搓出来了：

```lilypond
ghost = #(define-scheme-function
           (note)
           (ly:music?)
           #{
             <\parenthesize #note \omit #(make-articulation "accent" 'midi-extra-velocity -50)>
           #}
           )

% 乐谱里用 `\ghost sn4` 这样的方式调用
```

# 参考

-   `midi-extra-velocity`: http://lilypond.org/doc/v2.22/Documentation/internals/music-properties
-   `make-articulation`: https://github.com/lilypond/lilypond/blob/92eceab070090ffa3eca29489733868b0c6d2d11/scm/music-functions.scm#L729-L741
-   LilyPond - Extending v2.22.2 - 2.2 Scheme functions: http://lilypond.org/doc/v2.22/Documentation/extending/scheme-functions
-   LilyPond — Notation Reference v2.23.12 - 5.4.7 Visibility of objects, Removing the stencil: https://lilypond.org/doc/v2.23/Documentation/notation/visibility-of-objects#removing-the-stencil
