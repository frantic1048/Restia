---
date: 2014-05-12
title: Linux下通过cue分轨成flac
tags: [Blog, Life, Linux]
category: Misc
---

最近遇到分轨的问题，一个巨大的文件跟着一个 cue 个人觉得还是不方便，网上查了一下最后翻到了[Archwiki][archwiki-cue splitting]上面找到了比较完整的解决办法，把分轨和标签填充一并搞定了，另外顺便把封面嵌入也一起解决。

#预备工具

我是直接把 wiki 里面提到的工具都给安装了，这里给个列表，直接用 pacman 安装即可。

-   shntool （用于分割音频文件）
-   bchunk （iso/bin 文件支持）
-   mac （APE 编解码器）
-   flac （flac 编码器）
-   wavpack （wav 支持）
-   lame （MP3 编码器）
-   mp3info （MP3 ID3 1.x 标签支持）
-   vorbis-tools （Ogg 的额外工具）
-   cuetools (cue,toc 文件解析)

#开始分轨

接下来通过 cue 文件进行分轨，这里是我平常用的方法

    shnsplit -f file.cue -o flac -t "%n %t" file.wav

> -f 选项指定用来作为分轨依据的 cue 文件
> -o 选项可以指定输出文件格式，这里用的是 flac
> -t 用来自定义输出文件的文件名，用一个字符串作为参数，%n 表示轨道编号，%t 表示轨道标题，%a 为专辑名，%p 为表演者。
> 最后一个参数是被用来分轨的音频文件

执行之后会在当前目录生成分轨后的文件。

#标签/封面

使用 cuetag 一键完成，它会自动根据 cue 里面的轨道信息和分轨后的文件的名字自动填标签。

    cuetag.sh file.cue *.flac

关于添加封面，这里直接使用了 ubuntu 论坛上找到的现成的脚本，用封面文件作为参数运行脚本之后它会自动把图片嵌入当前目录和子目录的 flac 文件中。

    #!/bin/bash
    #
    # This script embeds a given image (usually .jpg) as album art in the
    # FLAC files in the present directory (and its subdirectories).
    #
    # Time-stamp: <2011-07-31 20:43:23 (lennart)>

    coverart=$1

    find . -name "*.flac" -print0 |xargs -0 metaflac --import-picture-from="$coverart"

至此，一切就搞定啦！

[archwiki-cue splitting]: https://wiki.archlinux.org/index.php/APE+CUE_Splitting
