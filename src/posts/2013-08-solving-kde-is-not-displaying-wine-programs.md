---
date: 2013-08-19
title: 解决KDE应用菜单不显示wine程序组的问题
tags: [Linux, KDE, Archlinux]
category: Tech
---

-   KDE 版本：4.10.5
-   wine 版本：1.7.0

刚用 wine 装了几个程序，发现 K 应用菜单里面没有 wine 程序的这个分类，wine 程序全部跑到 `Lost + Found` 这分组去了。上网搜索一番，没找到问题原因的描述，就找到下面的解决方法，似乎是因为 wine 没有修改到 KDE 使用的造成的？

    ln -s ~/.config/menus/applications-merged ~/.config/menus/kde-applications-merged
