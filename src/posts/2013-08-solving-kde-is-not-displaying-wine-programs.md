---
date: 2013-08-19
title: 解决KDE应用菜单不显示wine程序组的问题
tags: [Linux, KDE, Archlinux]
category: Tech
---

- KDE版本：4.10.5
- wine版本：1.7.0

刚用wine装了几个程序，发现K应用菜单里面没有wine程序的这个分类，wine程序全部跑到 `Lost + Found` 这分组去了。上网搜索一番，没找到问题原因的描述，就找到下面的解决方法，似乎是因为wine没有修改到KDE使用的造成的？

    ln -s ~/.config/menus/applications-merged ~/.config/menus/kde-applications-merged