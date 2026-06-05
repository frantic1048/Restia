---
date: 2013-08-11
title: 在Arch中安装和使用virtualenv
tags: [Linux, Arch, Python]
category: Tech
---

刚刚换到 Arch，发现不少东西操作都有点变化。想当然已经解决不了问题了 x_x，遂将其记下来。

## 安装

在 Arch 仓库里面有俩个`virtualenv`,根据需要安装即可。

    # pacman -S python2-virtualenv

或者

    # pacman -S python-virtualenv

前者对应的是 python2,后者 python3。命令行命令分别是`virtualenv2`和`virtualenv`。

##使用

首先为`virtualenv`创建一个目录：

    $ mkdir -p ~/.virtualenvs/my_env

创建虚拟环境

    $ virtualenv2 ~/.virtualenvs/my_env

激活环境以供使用（就这步和关闭虚拟环境跟 windows 下面不一样，让我撞墙好久）

    $ source ~/.virtualenvs/my_env/bin/activate

之后你就可以在虚拟环境里面用`pip`安装你需要的包，以及干各种事情啦。

最后是离开虚拟环境

    (my_env)$ deactivate

##参考

[Arch Wiki:Python VirtualEnv](https://wiki.archlinux.org/index.php/Python_VirtualEnvb)
