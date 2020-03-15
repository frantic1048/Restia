---
date: 2013-08-10
title: 通过字体文件给 Arch Linux 安装字体
tags: [Linux, Arch, font]
category: Tech
---

适用情况：

-   搬运 windows 那边的字体到 Arch Linux
-   安装从网上下载的字体文件
-   其它需要手动安装字体文件的情况

Arch 的字体目录为`/usr/share/fonts`，安装字体时建议在这里建立单独的文件夹来存放手动安装的字体(比如这里建立了一个 winfont 文件夹)

    sudo mkdir /usr/share/fonts/winfont

将你要安装的字体文件复制到`/usr/share/fonts`下你建立的文件夹中

    sudo cp -r /directory-to-your-font /usr/share/fonts/winfont

（注意这些字体文件的访问权限，至少要普通用户可读才行，否则就用`chmod`修改一下文件权限）

然后执行

    sudo mkfontscale
    sudo mkfontdir
    sudo fc-cache -fsv

这样就安装完成了。
