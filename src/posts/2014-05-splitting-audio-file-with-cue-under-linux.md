---
date: 2014-05-12
title: Linux下通过cue分轨成flac
tags: [Blog, Life, Linux]
category: Misc
---

最近遇到分轨的问题，一个巨大的文件跟着一个cue个人觉得还是不方便，网上查了一下最后翻到了[Archwiki][archwiki-CUE Splitting]上面找到了比较完整的解决办法，把分轨和标签填充一并搞定了，另外顺便把封面嵌入也一起解决。

#预备工具

我是直接把wiki里面提到的工具都给安装了，这里给个列表，直接用pacman安装即可。

- shntool （用于分割音频文件）
- bchunk （iso/bin文件支持）
- mac （APE编解码器）
- flac （flac编码器）
- wavpack （wav支持）
- lame （MP3编码器）
- mp3info （MP3 ID3 1.x标签支持）
- vorbis-tools （Ogg的额外工具）
- cuetools (cue,toc 文件解析)

#开始分轨

接下来通过cue文件进行分轨，这里是我平常用的方法

    shnsplit -f file.cue -o flac -t "%n %t" file.wav 

> -f选项指定用来作为分轨依据的cue文件
> -o选项可以指定输出文件格式，这里用的是flac
> -t用来自定义输出文件的文件名，用一个字符串作为参数，%n表示轨道编号，%t表示轨道标题，%a为专辑名，%p为表演者。
> 最后一个参数是被用来分轨的音频文件

执行之后会在当前目录生成分轨后的文件。

#标签/封面

使用cuetag一键完成，它会自动根据cue里面的轨道信息和分轨后的文件的名字自动填标签。

    cuetag.sh file.cue *.flac

关于添加封面，这里直接使用了ubuntu论坛上找到的现成的脚本，用封面文件作为参数运行脚本之后它会自动把图片嵌入当前目录和子目录的flac文件中。

    #!/bin/bash
    #
    # This script embeds a given image (usually .jpg) as album art in the
    # FLAC files in the present directory (and its subdirectories).
    #
    # Time-stamp: <2011-07-31 20:43:23 (lennart)>
    
    coverart=$1
    
    find . -name "*.flac" -print0 |xargs -0 metaflac --import-picture-from="$coverart" 

至此，一切就搞定啦！

[archwiki-CUE Splitting]: https://wiki.archlinux.org/index.php/APE+CUE_Splitting
