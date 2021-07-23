---
title: 在 Arch Linux 上使用 LilyPond 记录鼓谱
date: 2021-07-19
tags: [LilyPond, MuseScore, Drum score, Arch Linux, 鼓，乐谱]
category: Music
cover: ../static/photo/drums/_DSC0838.jpg
---

最近[许久没打 OSU! 了](https://osu.ppy.sh/u/frantic1048)，一方面是感觉手指手腕很累（单手 XZCV 默认键位太鼓模式受害者），再玩下去迟早要完，另一方面是摸了个太鼓控制器来玩也感觉不是很带感，又不想止于听音乐，不如尝试一下真的乐器吧，所幸遇到了很棒的老师，摸到了[爵士鼓](https://en.wikipedia.org/wiki/Drum_kit)的大门。

作为听说读写学习的一部分，同时也是为了能理解和学感兴趣的歌，以及基本的交流需要，记谱是必要的一环。为了在电脑(Arch Linux)上记谱，需要能满足这些预期的软件：

-   能输出常见的五线谱格式的鼓谱，pdf 或者任意矢量图片格式都行
-   能打一些简单文字标注
-   能听个响，生成任意音频文件

经过一波大浪淘沙，得到如下两个选择：

1. [MuseScore](https://musescore.org/)
    - 鼓谱支持：[MuseScore Drumline extension](https://musescore.org/en/mdl)
2. [LilyPond](https://lilypond.org/)
    - 音频输出：
        - MIDI 合成器：[Timidity++](http://timidity.sourceforge.net/)
        - SoundFont：[FluidR3](http://www.hammersound.net/)
    - GUI 编辑器：[Frescobaldi](https://www.frescobaldi.org/)

两者尝试一番下来，简单来说，MuseScore 和 LilyPond 两个方向的体验就像 Word 和 LaTeX 的区别，两方表达力都很强，功能也都很丰富，主要是操作上风格相差很大，个人口味原因偏好 LilyPond 一些。

# 混沌的鼓谱

这里有必要提一下前面预期里的「常见的鼓谱」到底是什么，因为直接影响到了后面两个方案的体验。

第一天学认谱认硬件的时候就了解到了爵士鼓是复合乐器（多种乐器的组合，所以英文直接就干脆叫 [Drum Set](https://en.wikipedia.org/wiki/Drum_kit 'Drum kit') 或者 Drum Kit 了），因为硬件组合本身不固定，可能会少，[也可能有一大堆](https://www.youtube.com/watch?v=xL3qbz049Zk 'Meinl Drum Festival – Chris Coleman “GAIA“')，可能是量产的乐器，也可能是[鼓手 DIY 的神奇装备](https://www.youtube.com/watch?v=evJlAm5da5c&t=1216s '25 Drum Hacks Anyone Can Do - David Raouf: Reuse old cymbals')，甚至[是鼓手自己的大腿](https://www.youtube.com/watch?v=6R6boTblB10 'Benny Greb - Grebchestra')，另一方面敲同一个东西用各种姿势也会出现不同声音，这些操作不是很好标准化，然后刚好有五线谱这个现成的通用的表达能力也很好的通行格式就用上了，然后把里面的音符重新定义到和爵士鼓相关的乐器上，其它的时值、重复、强弱之类的功能就直接复用了。

实践上来说，鼓谱的单个音符有时候要表示最普通地敲特定乐器（敲军鼓、敲底鼓、敲重击镲、~~敲大腿~~……），有时候要表示用特定手法敲特定乐器（敲节奏镲中间、敲节奏镲镲帽、敲张开的踩镲边缘、敲半开的踩镲边缘、用鼓槌槌尖敲军鼓、用鼓棒末尾敲军鼓的鼓框……），有时候要表示敲出什么感觉的声音（重音、鬼音、渐强、渐弱……）。这些东西记录下来会长什么样子没有很统一的标准，因为硬件组合的不确定性，击打方式的不确定性，加上不同的人不同的实际需求和习惯，记录方式都会有差别，只有比较常用的一部分在不同地方写法比较一致，比如第一个军鼓用五线谱第二格的黑圈圈表示。很难去讨论绝对的正确的谱是怎么长的，配合作者给的额外信息比如图例之类的，能解释出原来作者要表达的意思就行，实在读不懂？那就问！

总结自己学过的谱、各个地方看到的谱、以及随手找到的一些各方对鼓谱记法的描述：

-   [MuseScore - Drum notation: Percussion staff types](https://musescore.org/en/handbook/3/drum-notation#staff-types)
-   [Mike Rolish - Guide To Drum & Percussion Notation](https://web.mit.edu/merolish/Public/drums.pdf)
-   [Adam Holmes - on drum set notation](https://adamholmesmusic.com/blog-on-drum-set-notation/)
-   [Drum Notation Guide – Drum Key](https://www.onlinedrummer.com/drum-key/)

符合我的预期的「常见的谱」是把用手和用脚（主要是底鼓和踩踩镲）的部分用两个声部（Voice）记录了，用[符杆](<https://en.wikipedia.org/wiki/Stem_(music)> 'Stem(music)')朝上的音符记录手打的部分，用符杆朝下的音符表示脚打的，这个记录方式在 MuseScore 和 LilyPond 的功能上来说，都是对应的记录多个声部的功能。

# MuseScore

MuseScore 由于单一一个软件把记谱、排版、回放全都带了，还有各种预置的乐谱模板，就成了首先尝试的对象。

## 安装与起手

### 安装 MuseScore

Arch Linux 官方软件仓库（官方仓库）里就有打好的 [musescore](https://archlinux.org/packages/community/x86_64/musescore/) 软件包可以直接装。

### 安装 MuseScore Drumline extension

可以参见上游给的指南：[MuseScore Drumline - Download & Installation](https://musescore.org/en/node/273636)，简单来说就是启动 MuseScore，打开菜单栏的 Help / Resource Manager，然后在 Extensions 里找到名为 _MuseScore Drumline_ 的扩展，戳它旁边的安装按钮就行了。

### 起手

正确完成安装之后，在 MuseScore 里创建新乐谱，到选择模板的步骤的时候，可以看到单独的一个名为 _MuseScore DrumLine_ 的分类，其中的 _MDL Drumset_ 就是普通爵士鼓用的乐谱模板。更多的使用介绍可以去 MuseScore 网站上翻。

## 体验

比较常用的功能基本不看文档也能戳出来，预览功能很棒，排版很好看。

发现鼠标键盘点点点起来不是很直观，经常在同一时刻已经有音符的时候想再插一个音符变成了插进了下一个音符的位置，操作的问题感觉多看看文档应该能熟练。

然后是自动休止符的插入的特性有点让人头疼，我就输入个刚学的动词大词怎么多了那么多休止符呢，这个功能大体上是 MuseScore 会保证每个小节、每个声部的全部音符的时值加起来是刚好一个小节，如果用户输入的末尾还没满一个小结，那么就会有自动的合适的时值的休止符冒出来去「填满」那个小节的时间，如果继续在那个小节插入音符，那么后面的休止符会自动缩短/消失，这个功能本身挺好的，只是有时候不好看，又[不能关掉](https://musescore.org/en/node/152116)，只能隐藏音符，感觉不是很优雅。

# LilyPond

发现 MuseScore 没有完全让我满意的时候，又来尝试了一下另一个比较著名的记谱工具 LilyPond。起初弹琴动听，做饭又好吃的[辣师傅](https://silverrainz.me/)有推荐我用这个来打谱，只是被我嫌弃起手麻烦一开始没尝试。实际体验一番下来，和 MuseScore 一样也有一些不满意的地方，但是因为灵活，又是基于纯文本的编辑方式，有变量之类的避免复制粘贴的功能，用着用着就真香了。

## 安装

### Tl;dr

安装下列软件包：

-   [lilypond](https://archlinux.org/packages/community/x86_64/lilypond/)
-   [timidity++](https://archlinux.org/packages/community/x86_64/timidity++/)
-   [soundfont-fluid](https://archlinux.org/packages/community/any/soundfont-fluid/)
-   [frescobaldi](https://archlinux.org/packages/community/any/frescobaldi/)

### 要装什么

LilyPond 是一个排版乐谱的软件，有了它就可以按照 LilyPond 的语法编写乐谱内容，让它排版出乐谱，然后以 PDF、SVG、PNG 等可以查看的格式来输出，它可以通过官方仓库的 `lilypond` 包安装。

LilyPond 不能输出能听个响的音频文件，但是它能将乐谱输出成 [MIDI](https://en.wikipedia.org/wiki/MIDI) 格式的音乐。MIDI 记录的是什么时间什么乐器响了这样的事情，没有记录声音，有点像乐谱，用了脑子才能理解，理解了也只能在脑子里响。虽说不能直接聆听，但是 MIDI 格式的音乐可以用 MIDI 合成器（可以是软件或者硬件，后面的提到的都是指软件形式的合成器）将其记录的内容「转化」成能听到的声音，这有点像是让程序来演奏一个乐谱，这里有个问题是程序并不知道什么乐器是怎样的声音，所以 MIDI 合成器在工作之前，还需要知道需要用到的乐器的声音，这就是与 MIDI 合成器一起工作的 [SoundFont](https://en.wikipedia.org/wiki/SoundFont) 提供的信息，它可以看成是程序要「演奏」 MIDI 时候用的乐器。乐谱（MIDI）只是指定了乐器种类，最后演奏出来的声音会随着演奏的人（MIDI 合成器）和乐器（SoundFont）的变化而出现差异，这里我只是想要预览一下 LilyPond 的乐谱，对音质和仿真程度都没有特别要求，搜寻一番 Arch Linux 官方仓库找到的一组选择是：

-   MIDI 合成器：[Timidity++](http://timidity.sourceforge.net/)，对应仓库里的 `timidity++` 包
-   SoundFont：[FluidR3](http://www.hammersound.net/)，对应仓库里的 `soundfont-fluid` 包

由于 LilyPond 是基于纯文本的乐谱格式，和写程序一样，要是有个语法高亮是再好不过的，如果能再随时看到刚刚编辑的输出那就更好了，搜寻一番之后找到的现成的程序是 [Frescobaldi](https://www.frescobaldi.org/)，可以通过仓库里的 `frescobaldi` 包安装。它有语法高亮，有实时预览，有一键播放，很够用了。只是作为文本编辑器，我目前最顺手的是 VSCode，理论上这套功能也能在 VSCode 上糊出来，获得更好的文本编辑体验，就差一位勇士去填这个坑了:p

## 整体使用流程

比如说，要编写这么一小节动词大词的乐谱，有图片，有声音（后文音频下方的链接皆为对应的 LilyPond 原文件）：

![simple-rhythm](../static/lilypond/lilypond-for-drums/simple-rhythm.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/simple-rhythm.m4a`  
[simple-rhythm.ly](../static/lilypond/lilypond-for-drums/simple-rhythm.ly)

对应的 LilyPond 文件可以这样写（个人总结的比较方便的写法）：

注：没有找到合适的 LilyPond 语法高亮，先用着语法比较接近的 LaTeX 高亮顶一顶。

```lilypond
\version "2.22.1"

main = {
  \drums {
    \tempo 4 = 100
    \numericTimeSignature
    \time 4/4

    <<
      {
        hh8 hh8 <<hh8 sn8>> hh8 hh8 hh8 <<hh8 sn8>> hh8
      }\\{
        bd4 r4 bd4 r4
      }
    >>
  }
}

\score {
  \main
  \layout {}
}

\score {
  % https://lilypond.org/doc/v2.22/Documentation/notation/using-repeats-with-midi
  \unfoldRepeats {
    \main
  }
  \midi {}
}
```

然后将上述内容存为名为 `simple-rhythm.ly` 的文件（以 `.ly` 结尾即可，这里名称只是示例）。

启动任意终端模拟器，将 shell 的工作目录切到 `simple-rhythm.ly` 所在的位置，执行以下可以得到排版好的 SVG 格式的乐谱和对应的 MIDI 文件：

```shell
lilypond -fsvg -dcrop simple-rhythm.ly
```

会得到：

-   `simple-rhythm.cropped.svg`：根据实际音符所占位置尺寸而裁切出的 SVG 图片，[由 `-dcrop` 参数控制生成](http://lilypond.org/doc/v2.22/Documentation/usage/command_002dline-usage#advanced-command-line-options-for-lilypond)。
-   `simple-rhythm.svg`：A4 纸尺寸的 SVG 图片。
-   `simple-rhythm.midi`：MIDI 文件，由 [`simple-rhythm.ly` 里的 `\midi {}` 控制](https://lilypond.org/doc/v2.22/Documentation/notation/the-midi-block)。

接下来再使用 timidity 处理上一步得到的 MIDI 文件，以及通过 ffmpeg 转换音频格式，就可以得到方便传输的 m4a 格式的音频：

```shell
timidity simple-rhythm.midi  -Ow -o - | ffmpeg -i - simple-rhythm.m4a
```

会得到 `simple-rhythm.m4a`，即为乐谱对应的音频。

看起来有点长，不要慌，比真的去打动词大词简单多了。

## 记录音符

首先，通过对照乐谱的图片和上面的内容，应该可以脑补到其中这段是记录音符的部分：

```tex
<<
  {
    hh8 hh8 <<hh8 sn8>> hh8 hh8 hh8 <<hh8 sn8>> hh8
  }\\{
    bd4 r4 bd4 r4
  }
>>
```

这里的每一个单词+数字组成的内容就是一个确定时值的音符，比如 `hh8`，表示八分音符长度的一次（闭合状态的）踩镲的敲击，数字前面的单词表示音符，数字本身表示时值，比如 `4` 就表示四分音符，以及再打一个小数点的话变成 `4.` 的话，就是附点四分音符。然后 `hh` 也可以写成 `hihat`，前面的音符可以写成 `hihat8`，表示的是完全相同的意思，只是简写和全写的关系，完整的简写/全写对照、以及更多的音色对应的记法可以参照[LilyPond — Notation Reference v2.22.1: A.15 Percussion notes](http://lilypond.org/doc/v2.22/Documentation/notation/percussion-notes)。本文后面也会列出一些常用的音符。

上面用到的剩下的音符分别是：

-   `bd`/`bassdrum`：底鼓
-   `sn`/`snare`：军鼓
-   `r`：休止符

知道音符含义之后，这个时候我们来看一下 `<<hh8 sn8>>`，这里面有两个不同的八分音符，然后回头听上面的动词大词，第三个和第七个八分音符的位置同时有踩镲和军鼓的声音，这个尖括号括起来就是表示里面的音符是在同一个时刻上的。

再把视野放大一点，看到包裹所有音符的那一大块符号：

```tex
<<
  {
    % 手上的音符
  }\\{
    % 脚上的音符
  }
>>
```

这是一种[记录两个声部内容的写法](http://lilypond.org/doc/v2.22/Documentation/notation/common-notation-for-percussion#percussion-staves)，两对 `{}` 里的内容分别对应乐谱的第一和第二声部，然后默认情况下两个声部的符杆方向是不一样的，把想要朝上的音符写在第一声部，朝下写第二声部，就达成了前面定义的鼓谱的音符的布局。这并不是唯一的控制音符朝向的方法，也不是唯一的描述多个声部的方法，只是写起来比较简单一点就这样了。另一方面，整个乐谱里面，可以有任意数量、先后出现的 `<<{}>>\\<<{}>>` 这样的记号，里面两个声部占的时值是相同的，实践上把一段节奏型的一个或者几个小节、一段 Fill in 的多个小节写成一块会比较方便，如果一块 `<<{}>>\\<<{}>>` 里的小节太多了的话，写到后面会比较难分辨两个声部分别写到哪儿了，怎么对应的。

### 音符时值与名字的简写

除了音符的名字有简写的别名之外，还有一些常用的简写重复内容的方式。

对于一串时值不同的同种音符，可以省掉第一个之后的音符的名字，只写表示时值的数字，比如：

![shorthand-1](../static/lilypond/lilypond-for-drums/shorthand-1.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/shorthand-1.m4a`  
[shorthand-1.ly](../static/lilypond/lilypond-for-drums/shorthand-1.ly)

```tex
sn8 sn16 sn16 sn16 sn16 sn8
% 可以简写成
sn8 16 16 16 16 8
```

对于一串时值相同的不同音符，可以省掉第一个之后音符的音符的时值，只写表示音符的标识，比如：

![shorthand-2](../static/lilypond/lilypond-for-drums/shorthand-2.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/shorthand-2.m4a`  
[shorthand-2.ly](../static/lilypond/lilypond-for-drums/shorthand-2.ly)

```tex
sn16 tomh16 toml16 sn16 toml16 sn16 tommh16 sn16
% 可以简写成
sn16 tomh toml sn toml sn tommh sn
```

简写虽然写起来少敲几下键盘，但是阅读起来不一定总是方便的，所以看情况用吧。

### 音符上的文字标注

比较常见的情景是标记左右手，在音符的末尾跟上 `^"TEXT HERE"` 就可以在音符上方加文字，如果把 `^` 换成 `_` 的话，文字就会出现在音符下方。

![text](../static/lilypond/lilypond-for-drums/text.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/text.m4a`  
[text.ly](../static/lilypond/lilypond-for-drums/text.ly)

```tex
sn4^"L" 4^"R" 4_"L" 4_"R"
16^"L" 16^"R" 8^"L" 8^"L" 16^"L" 16^"R"
16_"L" 8_"R" 16_"R" r16 sn16_"R" 16_"L" 16_"R"
```

更多形式的文字和样式设定参见 [LilyPond — Notation Reference v2.22.1: 1.8.1 Writing text](http://lilypond.org/doc/v2.22/Documentation/notation/writing-text)。

### 连音（Tuplet）

[连音](https://en.wikipedia.org/wiki/Tuplet)可以用来表示一些不能用简单时值记号表示的~~伤害大脑的~~时值。比如说，把一个四分音符的时值分成三等分，重新分给一长一短的两个或者一样长度的三个音符这样的操作。

以一个四分音符分长度里演奏均匀的三个音符的，三连音八分音符来说，表示的方式是 `\tuplet 3/2 {sn8 sn8 sn8}`，`{}` 内的音符是要塞到一组连音里面的音符，`3/2` 表示 `{}` 里的音符的时值变成了原来塞`2`个音符的时间长度里要塞`3`个同样的音符才能填满，或者说 `{}` 里一个音符的时值变成原来长度的 `2/3`，结果就是三连音八分音符看起来是 `3` 个八分音符，实际占的是 `2` 的正常的八分音符的时间长度。另外在表示时值变化的分数后面可以多写一个数字，表示连音要以几分音符的长度进行分组显示，在写一长串同类连音的时候比较方便。

![triplets](../static/lilypond/lilypond-for-drums/triplets.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/triplets.m4a`  
[triplets.ly](../static/lilypond/lilypond-for-drums/triplets.ly)

```tex
sn8 8 8 8 \tuplet 3/2 4 {8 8 8 8 8 8}
```

更多细节参见 [LilyPond — Notation Reference v2.22.1: 1.2.1 Writing rhythms#Tuplets](http://lilypond.org/doc/v2.22/Documentation/notation/writing-rhythms#tuplets)

### 连接线（Tie）

这里指[连接两个同种音符的弧线](<https://en.wikipedia.org/wiki/Tie_(music)>)，在两个要连线的音符的第一个音符末尾加一个 `~` 即可，比如 `bd8~ bd8`。

![tie](../static/lilypond/lilypond-for-drums/tie.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/tie.m4a`  
[tie.ly](../static/lilypond/lilypond-for-drums/tie.ly)

```tex
<<
  {
    hh8 8 <<hh8 sn8>> hh8 8 8 <<hh8 sn8>> cymc8~
    cymc8 hh8 <<hh8 sn8>> hh8 8 8<<hh8 sn8>> hh8
  }\\{
    bd4 r4 bd8 8 r8 bd8~
    bd8 bd8 r4 bd8 8 r4
  }
>>
```

更多细节参见[LilyPond — Notation Reference v2.22.1: 1.2.1 Writing rhythms#Ties](http://lilypond.org/doc/v2.22/Documentation/notation/writing-rhythms#ties)

### 即兴记号（Improvisation）

即兴记号用来表示一段主体节奏确定，具体怎么演奏随意发挥的内容。这个功能是由 `\improvisationOn`、`\improvisationOff` 两个命令组成的，这两个命令之间的音符会变成即兴记号（一条斜线），音符的种类会影响斜线在五线谱的上下位置，以及输出音频的时候，即兴部分会用指定的音符的音色（虽然显示上是一条斜线），一般都用同一种音符就行了，毕竟只是为了表示节奏，用 `sn` 起始画出来差不多在中间的位置，应该有更细节的控制样式的操作，这里就不细说了。

![improvisation](../static/lilypond/lilypond-for-drums/improvisation.cropped.svg)  
`audio: ../static/lilypond/lilypond-for-drums/improvisation.m4a`  
[improvisation.ly](../static/lilypond/lilypond-for-drums/improvisation.ly)

```tex
<<
  {
    hh 8 8 8 8
    \improvisationOn
    sn4. 8~
    4. 8~ 4. 8
    \improvisationOff
  }\\{}
>>
```

更多细节参见[LilyPond — Notation Reference v2.22.1: 1.1.4 Note heads#Improvisation](http://lilypond.org/doc/v2.22/Documentation/notation/note-heads#improvisation)

### 重音/强调（Accent）

在普通音符后面写上`->`即为重音，比如普通的敲军鼓 `sn8`，对应重音的话写成 `sn8->`。

更多细节参见[LilyPond — Notation Reference v2.22.1: 1.3.1 Expressive marks attached to notes#Articulations and ornamentations](https://lilypond.org/doc/v2.22/Documentation/notation/expressive-marks-attached-to-notes#articulations-and-ornamentations)

### 鬼音（Ghost note）

在音符前面加上 `\parenthesize` 就会把原来的音符变成鬼音，比如 `sn8` 对应的鬼音的话写成 `\parenthesize sn8`。

更多细节参见[LilyPond — Notation Reference v2.22.1: 2.5.1 Common notation for percussion#Ghost notes](http://lilypond.org/doc/v2.22/Documentation/notation/common-notation-for-percussion#ghost-notes)

### 常用的音符

| 乐器/击打方式/音色                                             | LilyPond 的写法         | 说明                                                                                                                                                                                                              |
| :------------------------------------------------------------- | :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [底鼓（Bsss drum）](https://en.wikipedia.org/wiki/Bass_drum)   | `bd`, `bassdrum`        | 普通一击                                                                                                                                                                                                          |
| 一嗵鼓                                                         | `tomh`, `hightom`       | 适用于三个嗵鼓的情况，其它数量的有别的嗵鼓音符可以用。                                                                                                                                                            |
| 二嗵鼓                                                         | `tommh`, `himidtom`     | 适用于三个嗵鼓。                                                                                                                                                                                                  |
| 落地嗵鼓                                                       | `toml`, `lowtom`        | 适用于三个嗵鼓。                                                                                                                                                                                                  |
| [军鼓（Snare drum）](https://en.wikipedia.org/wiki/Snare_drum) | `sn`, `snare`           | 普通一击                                                                                                                                                                                                          |
| 边击（Rimshot）                                                |                         | 同时击中鼓面和鼓框的认真一击<br>没有找到直接的音符，但是[可以手动用 LilyPond 指令画出来](http://lilypond.1069038.n5.nabble.com/How-to-display-a-rim-shot-td215972.html)<br>退一步可以用写成军鼓的重音 `sn->`      |
| 制音边击（Cross Stick/Side Stick/Rim Click）                   | `ss`, `sidestick`       | [槌头放鼓面上，用鼓槌尾部敲鼓框，类似敲木头的声音](https://www.youtube.com/watch?v=GpHFFR1Zyt4)                                                                                                                   |
| 鬼音（Ghost note）                                             | `\parenthesize sn`      | [非常轻的一击，几乎听不到，但是有一点感觉的声音](https://www.youtube.com/watch?v=NdoKq0t2PBo 'Beginner Ghost Notes - Drum Lesson (DRUMEO)')                                                                       |
| Stick Shot                                                     |                         | [一只鼓槌槌头放在鼓面，用另一只鼓槌敲鼓槌的中间部分](https://www.youtube.com/watch?v=C2ll3MDx2AQ 'Jazz Drummer Q-tip of the Week: Stick Shot Applications!')<br>没有找到直接的音符，可能也是要手画。              |
| 重击镲                                                         | `cymc`, `crashcymbal`   |                                                                                                                                                                                                                   |
| 节奏镲                                                         | `ride`, `ridecymbal`    | 普通敲击镲面                                                                                                                                                                                                      |
| 节奏镲（镲帽）                                                 | `rb`, `ridebell`        | 敲节奏镲的镲帽                                                                                                                                                                                                    |
| 踩镲                                                           | `hh`, `hihat`           | 闭合状态踩镲的敲击                                                                                                                                                                                                |
| 踩镲（闭合）                                                   | `hhc`, `closedhihat`    | 闭合状态踩镲的敲击<br>一般用 `hh` 可以替代，这个主要是更明显地标示踩镲的闭合                                                                                                                                      |
| 踩镲（全开）                                                   | `hho`, `openhihat`      | 张开状态踩镲的敲击                                                                                                                                                                                                |
| 踩镲（半开）                                                   | `hhho`, `halfopenhihat` | 半开状态的踩镲的敲击                                                                                                                                                                                              |
| 踩镲（脚踏）                                                   | `hhp`, `pedalhihat`     | 脚踏控制的一次踩镲开-合，让两个镲片碰撞产生的声音                                                                                                                                                                 |
| 踩镲（Foot Splash/Hihat Splash）                               |                         | [脚踏控制的一次踩镲的开-合-开，让镲片碰撞产生声音并且延续](https://www.youtube.com/watch?v=q-beyteedQo 'Developing Hi Hat Splash Technique')<br>没有直接能用的音符，一些地方记录成 `hhp` 的符号再多加一个圆圈表示 |

更多参照[LilyPond — Notation Reference v2.22.1: A.15 Percussion notes](http://lilypond.org/doc/v2.22/Documentation/notation/percussion-notes)。

自定义音符的样式和位置可以从这里开始：[LilyPond — Notation Reference v2.22.1: 2.5.1 Common notation for percussion#Custom percussion staves](http://lilypond.org/doc/v2.22/Documentation/notation/common-notation-for-percussion#custom-percussion-staves)。

## 乐谱的总体设定

一个乐谱除了音符之外，还需要一些额外的信息才能变得完整，比如拍号、速度之类的，这就是把音符括起来的外面一圈内容表示的信息：

```tex
\drums {
  \tempo 4 = 100
  \numericTimeSignature
  \time 4/4

  % 乐谱的音符...
}
```

`\time 4/4` 比较直观，是指每小节四拍，四分音符一拍的拍号，它表示随后的音符都是按照这个拍号来的，如果乐谱到中间要改变拍号了，就再写一个 `\time` 指定新的拍号就好了。更多用法参见 [LilyPond — Notation Reference v2.22.1: 1.2.3 Displaying rhythms#Time signature](http://lilypond.org/doc/v2.22/Documentation/notation/displaying-rhythms#time-signature)。

`\numericTimeSignature` 会让其后出现的拍号显示成数字的形式，默认情况下 LilyPond 会将 `4/4` 拍显示成一个大 C 记号，[这是另外一种流派的拍号表示](http://lilypond.org/doc/v2.22/Documentation/notation/typesetting-mensural-music#mensural-time-signatures 'Mensural time signatures')，可以根据个人需要选择拍号的表示。

`\tempo 4 = 100` 表示了乐谱的速度，`4 = 100` 即为每分钟 100 个四分音符。除了用固定的数字表示之外，速度也可以定成一个范围，比如 `\tempo 4 = 100 - 120`，或者用文本的方式表示，例如 `\tempo "Allegretto"`，或者你不想做选择题，数字文字全都要也是可以的，不给乐谱写 `\tempo` 标记速度也可以，都可以，参见 [LilyPond — Notation Reference v2.22.1: 1.2.3 Displaying rhythms#Metronome marks](http://lilypond.org/doc/v2.22/Documentation/notation/displaying-rhythms#metronome-marks)。

`\drums {}` 表示记录一段鼓谱（准确来说是打击乐谱），只是写鼓谱的话不用太关心它背后具体的功能，好奇的话可以参见 [LilyPond — Notation Reference v2.22.1: 2.5.1 Common notation for percussion#Basic percussion notation](http://lilypond.org/doc/v2.22/Documentation/notation/common-notation-for-percussion#basic-percussion-notation)。

另外，以 `%` 开头的一行内容是注释，那一行的内容不会被 LilyPond 处理。

## 乐谱的输出设定

虽然已经能表示鼓谱，能写音符了，还需要一些操作让 LilyPond 知道总共有哪些乐谱，需要怎么被输出，所以有了剩下的一块内容：

```tex
\version "2.22.1"

main = {
  \drums {
    % 乐谱内容
  }
}

\score {
  \main
  \layout {}
}

\score {
  % https://lilypond.org/doc/v2.22/Documentation/notation/using-repeats-with-midi
  \unfoldRepeats {
    \main
  }
  \midi {}
}
```

### 变量的使用

首先是离乐谱最近的 `main = {}`，这是 LilyPond 的定义变量的功能，随后的地方可以用 `\main` 这个写法来引用 `main = {}` 里面包含的乐谱，`main` 这个名字只是顺手取的，可以根据实际内容取合适的名字，可以是一整个乐谱（示例的使用场景），也可以是一小段音符，比如：

(注意：鼓谱的音符需要用 `\drummode` 包起来)

```tex
dadada = { \drummode { sn8 8 8 8 8 8 8 8 } }
zizizi = { \drummode { hh8 8 8 8 8 8 8 8 } }

main = {
  \drums {
    % 引用上面的两段内容
    \dadada \zizizi
    \zizizi \dadada
  }
}
```

更多关于变量的使用介绍参见 [LilyPond — Learning Manual v2.22.1: 2.4.1 Organizing pieces with variables#Basic percussion notation](http://lilypond.org/doc/v2.22/Documentation/learning/organizing-pieces-with-variables)

### 排版与 MIDI 输出

`\score {}` 是 LilyPond 文件的基本组成单位，所有的表示音乐的内容都需要放到某个 `\score` 里面。`\score` 内部的 `\layout` 表示为当前 `\score {}` 内的音乐排版一份可打印的输出，而 `\midi` 是表示为 `\score {}` 里的音乐创建一份 MIDI 输出。

理论上一个乐谱只需要一个 `\score {}`，直接写成：

```tex
\score {
  {
    % 令人心动的音乐
  }
  \layout
  \midi
}
```

就可以表示同时输出可打印的输出和 MIDI 输出了。**但是**，由于 LilyPond 有[表示乐谱的各种形式的重复](https://lilypond.org/doc/v2.22/Documentation/notation/repeats)的记号，它们不能被直接转换成 MIDI 信号，如果不加处理的话，重复记号部分的音符会在最后生成的音频里没有声音。可是重复记号是乐谱不可分割的一个基本功能，用还是得用的，于是 LilyPond 给出的方案是把乐谱分成两份，一份普通地用 `\layout` 产生一份可打印的输出，另一份，先把重复记号都展开成实际的音符（`\unfoldRepeats {}` 所做的事情），然后再产生 MIDI 输出，结果就变成了写两个 `\score {}` 的样子。

更多关于 MIDI 输出与重复记号问题的说明参见 [LilyPond — Notation Reference v2.22.1: 3.5.6 Using repeats with MIDI](http://lilypond.org/doc/v2.22/Documentation/learning/introduction-to-the-lilypond-file-structure)。

更多关于 LilyPond 的文件结构的说明参见 [LilyPond — Learning Manual v2.22.1: 3.1.1 Introduction to the LilyPond file structure](http://lilypond.org/doc/v2.22/Documentation/learning/introduction-to-the-lilypond-file-structure)。

另外，如果想给乐谱加上标题和署名之类的信息的话，参见：[LilyPond — Notation Reference v2.22.1: 3.2.1 Creating titles headers and footers](http://lilypond.org/doc/v2.22/Documentation/notation/creating-titles-headers-and-footers)。

最后，文件开头还有个 `\version "2.22.1"`，这是标识这份 LilyPond 文件对应需要什么版本的 LilyPond 才能处理的，通常来说，在你遇到问题之前都不用关心它。如果使用 Frescobaldi 来编写 LilyPond 文件的话，它会自动为新文件创建一行合适的 `\version`。

## 生成乐谱

乐谱都写好了，排版的事情就可以交给 LilyPond 了，在终端里使用 lilypond 命令就可以创建排版好的图片格式的乐谱，以及 MIDI：

```shell
lilypond -fsvg -dcrop "刚刚写好的 LilyPond 乐谱.ly"
```

关于参数上，常用的有 `-f`，后面跟上文件的格式，可以控制输出的格式，比如 `pdf`、`png`，打印的话当然是 `pdf`，网页上使用的话，比较适合用 `SVG` 格式，因为能获得不受缩放影响的清晰图像。（注：MIDI 格式是只要文件里写了 `\midi` 就会输出，不需要在这里额外加参数）。

`-dcrop` 并不是必须的，只有在需要输出一小段乐谱的图片的时候才会用到。因为 LilyPond 默认输出的是 A4 尺寸的内容，即使只有一个小节的内容也会用那么大的面积，像本文里用到的乐谱片段的图片的话，我只需要只包含音符一个小小的图片，就需要用这个参数了。

完整的参数说明参见 [LilyPond — Usage v2.22.1: 1.2 Command-line usage](http://lilypond.org/doc/v2.22/Documentation/usage/command_002dline-usage)。

## 生成音频

前面提到了，`timidity` 可以用来从 LilyPond 产生的 MIDI 文件生成能听的音频，使用上像是这样：

```shell
timidity "刚刚写好的 LilyPond 乐谱.midi"  -Ow -o "刚刚写好的 LilyPond 乐谱.wav"
```

`-Ow` 参数会让 timidity 输出 WAV 格式的音频。`-o` 是指定输出要保存到的文件名字。

更多 timidity 的参数参见 [timidity(1)](https://man.archlinux.org/man/timidity.1)。

其实 WAV 格式已经是能够用常规的音频播放器播放的了，如果想得到别的格式的音频，可以用 `ffmpeg` 来转换一下，比如生成在这个页面里用的 `m4a` 格式的音频，就可以：

```shell
timidity "刚刚写好的 LilyPond 乐谱.midi"  -Ow -o - | ffmpeg -i - "刚刚写好的 LilyPond 乐谱.m4a"
```
