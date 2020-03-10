---
date: 2014-12-13
title: 解决 zip 文件名乱码的小脚本
tags: [Linux, zip, 乱码]
category: Tech
---

Linux 下 zip 文件名乱码的问题想必路人皆知，zip 就是事儿多ˊ_>ˋ

一个解压 zip 的小脚本，如果遇到非 `gbk` 的其他奇葩编码自行改变 `codeType` 的值尝试即可_(:з」∠)_

用法：`unzip-gbk.py xxx.zip`

代码修改自[九原笔记](http://note.ninehills.info/linux-gbk.html)，改成了解压到子文件夹。

    #!/usr/bin/env python2
    # -*- coding: utf-8 -*-
    # unzip-gbk.py

    import os
    import sys
    import zipfile

    codeType = 'gbk'

    print(u'开始提取：' + sys.argv[1])
    with zipfile.ZipFile(sys.argv[1], 'r') as file:
      folderName = sys.argv[1].rsplit('.', 1)[0]
      for name in file.namelist():
          utf8Name = os.path.join(folderName, name.decode(codeType))
          pathName = os.path.dirname(utf8Name)
          print(u'正在提取： ' + utf8Name)
          if not os.path.exists(pathName) and pathName != '':
              os.makedirs(pathName)
          data = file.read(name)
          if not os.path.exists(utf8Name):
              with open(utf8Name, 'w') as fo:
                fo.write(data)
