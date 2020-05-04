---
date: 2015-04-30
title: 在 Umbrello 的序列图中添加参与者
tags: [Linux, UML]
category: Tech
---

这几天用 [Umbrello](https://umbrello.kde.org/) 画作业，在画序列图（Sequence diagram）的时候发现工具栏上竟然没有添加参与者（Actor）的按钮。

我感到很是困惑，因为之前画用例图（Use Case diagram）的时候是有的，序列图也是包含参与者这种单位的，然而工具栏却看不到它的身影。先搜索一番还看到有人把这个报成 [bug](http://osdir.com/ml/linux.umbrello.devel/2006-03/msg00123.html)，难道就因为这种小事换工具？脑中浮现隔壁用 Photoshop 画 UML 的家伙的嘲讽。一番摸索后发现了另一种添加参与者的方法：

1. 在 `Tree View` 里面，右键戳里面的 `Use Case View`，选择 `New > Actor`。

2. 这时 `Use Case View` 下面会出现一个新的的 `Actor`，双击它编辑好必要的信息。

3. 打开要添加 `Actor` 的的序列图，在 `Tree View` 里面直接把那个 `Actor` 托放进编辑区，成了 (｡･ω･)ﾉ

接下来就可以愉快地继续做作业了。
