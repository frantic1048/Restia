---
title: 给windows添加用Notepad++打开的右键菜单
date: 2013-06-17
tags: [Windows]
category: Tech
---

操作很简单:

创建一个文本文件,键入以下内容后保存为reg文件,最后双击添加注册表项即可

注意:*最下面一行中的文件目录为你的电脑上的Notepad++可执行文件所在位置*

    Windows Registry Editor Version 5.00

    [HKEY_CLASSES_ROOT\*\shell\notepad++]
    @="Edit with Notepad++"

    [HKEY_CLASSES_ROOT\*\shell\notepad++\command]
    @="\"C:\\Program Files (x86)\\notepad++\\notepad++.exe\" %1"
