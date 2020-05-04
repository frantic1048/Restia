---
date: 2015-11-10 16:56:46
title: 解决一个诡异的 MySQL Workbench 崩溃问题
tags: [Linux, MySQL]
category: Linux
---

用 MySQL Workbench 的时候戳了一下选项卡的关闭按钮，它就直接崩溃了。

之后启动 MySQL Workbench 的时候出现以下错误直接崩溃，无论重启动系统，或重新安装它均无法解决。

```
*** Error in `/usr/bin/mysql-workbench-bin': double free or corruption (out): 0x00000000011a5f00 ***
```

最后，[网上](https://bugs.launchpad.net/ubuntu/+source/mysql-workbench/+bug/1386107)搜到了这个神奇的操作一下子解决了问题，MySQL Workbench 能启动了。

```bash
rm ~/.mysql/workbench/wb_options.xml
```

然而发现之前做了半天的 .mwb 文件打不开了，各种姿势用 MySQL Workbench 打开各种姿势闪退，然后又得执行上面的删除操作才能启动。最后排查发现打开的文件路径全英文的话就没事儿了 (╯°□°）╯︵ ┻━┻
