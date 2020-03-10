---
title: 用SMPlayer生成视频预览
date: 2014-03-01
tags: [Video, Windows, Linux, Life]
category: Tech
---

![][video_preview_demo]

最近需要用到了这个功能（如图），后来找到了SMPlayer这个播放器，可以直接生成这种预览图。并且SMPlayer本身跨Linux和Win两个平台，同时也提供源码，这点也很方便。

目前SMPlayer已经在Arch的官方源里面了，直接`pacman -S smplayer`即可安装。

要想生成预览，直接用它打开要生成预览的视频文件，点一下菜单栏的`视频`-->`预览`，就可以打开生成预览的对话框，目前我用的版本是``，可以看到能够调整的选项还是蛮多的。选项设置好之后，点击生成，出来大图之后保存即可。

[video_preview_demo]: /image/Last-Smile-preview.webp