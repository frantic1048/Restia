---
date: 2015-01-14
title: 解决 MacOS 不能开中文版 AI
tags: [Illustrator]
category: Tech
---

`Mac` 上开中文 `Adobe Illustrator` 会有鬼畜的错误对话框出现，进去之后几乎所有中文变成问号。刚帮某同学解决了这个问题，权当记录。方法是网上扒到的，倒是简单。

以下是记录终端中的操作方法，如果不放心就直接复制粘贴命令吧 _(:з」∠)_

#步骤 1：

打开终端，来到 `AI` 的目录，一般形如一下， `cd` 过去即可：

    cd /Applications/Adobe\ Illustrator\ CS6/Adobe\ Illustrator.app/Contents/MacOS

注意这个路径是从根目录开始的。

#步骤 2：

把目录下的名为 `Adobe Illustrator` 的文件更改个名字（这里改名为 `AICS6` ），用 `mv` 即可。

    mv Adobe\ Illustrator AICS6

#步骤 3：

创建一个新的名为 `Adobe Illustrator` 文件，内容如代码所示，`cat` 搞定～

    cat > Adobe\ Illustrator <<'EOF'
    #!/bin/bash

    BASEDIR=$(cd "$(dirname "$0")"; pwd)
    "$BASEDIR/AICS6" -AppleLanguages '("zh-Hans")'
    EOF

#步骤 4：

给刚刚创建的文件赋予执行权限， `chmod` 搞定。

    chmod +x Adobe\ Illustrator

#步骤 5：

这个时候你就可以去启动你的 `AI` 啦～
