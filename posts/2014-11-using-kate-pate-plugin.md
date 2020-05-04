---
date: 2014-11-04
title: 启用 Kate 的 Pate 插件
tags: [Linux, Arch, Kate]
category: Tech
---

想着用这么久 `Kate` 写东西，还是不能百分百的满意，毕竟有些功能还是没有，比如 `JSLint` ， `PEP8` 什么的，遂顺手一搜，发现原来 Kate 早就有这些功能的插件了，只是一直没发现，在 Kate 的设置窗口里面的 Application 类别下的 Plugins 里面有个不起眼的 `Pyhon Plugins`，这就是开启新世界的大门，不料勾上之后却发现了这样的提示。

> pate engine could not be initialized
> Cannot load kate module

继续在网上搜索了一下，告知用命令行直接启动 Kate 可以看到一些缺失包造成的 import error。发现是这俩个包找不到

-   jedi
-   PyKDE4

jedi 一下子就搞定了，然后发现根本找不到 `PyKDE4` ，在 Arch 论坛上发现这货改名字了，换成了 kdebindings 开头的包，随后 Pacman -Ss 了一下找出了这货。

    pacman -S python-jedi kdebindings-python

这下就没有之前的那些错误了，设置里面也出现了新的功能，新世界探索中……
