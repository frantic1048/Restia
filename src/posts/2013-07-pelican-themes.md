---
date: 2013-07-12
title: '[译]pelican-themes官方文档'
tags:
  - Blog
  - Pelican
  - Translation
category: Translation
---

这段时间倒腾主题，干到最后，发现仅仅改CSS无法让我满意，遂打算开始定制模板，说到主题，还是得先读文档，由于经常用到 __pelican-themes__，就顺便做个翻译便于查阅，同时根据我的理解进行了一点补充说明，这是本人第一次做翻译内容如有不当之处还请多多指正~


#pelican-themes

##描述

 __pelican-themes__ 是一个用来管理Pelican主题的命令行工具。

###用法

    pelican-themes [-h] [-l] [-i theme path [theme path ...]]
    [-r theme name [theme name ...]]
    [-s theme path [theme path ...]] [-v] [–version]

###可选参数

- `-h`,` --help` 显示帮助
- `-l`, `--list` 显示已安装的主题
- `-i theme_path` , `--install theme_path` 安装一个或多个主题
- `-r theme_name` , `--remove theme_name` 卸载一个或多个主题
- `-s theme_path` , `--symlink theme_path` 和 `–install` 一样都是安装,但是只创建一个符号链接，并不会复制主题目录，对主题开发很有用
- `-v` , `--verbose` 显示详细输出信息
- `--version` 显示版本

> 译者补充
> 
> 平常用 `-i theme_path` 安装主题的时候，_theme\_path_ 整个目录会被复制到pelican的目录下，并且pelican编译时使用的主题也是pelican目录下那份，如果用 `-s theme_path` 安装主题的话，就不会有复>制的过程，pelican编译时直接使用 _theme\_path_ 中的主题文件，显然这样对于一个正在制作过程中的主题进行“调试”与修改来得方便的多。

##示例

###列出已安装的主题

使用 `pelican-themes` 命令，通过 `-l` 或 `--list` 选项可以列出已经安装的主题

    $ pelican-themes -l

> notmyidea  
> two-column@  
> simple  

    $ pelican-themes --list
> notmyidea  
> two-column@  
> simple  

在本例中，我们可以看到有三个可用的主题： `notmyidea` , `simple`  和 `two-column`。

 `two-column` 被添加了一个前缀 `@` ,因为这个主题没有被复制到pelican的主题目录，而是仅仅创建了一个符号链接（详见后文 __创建符号链接__）。

注意，你可以把 `--list` 与 `-v` 或与 `--verbose` 选项结合起来以获得更加详细的输出，像这样：

    $ pelican-themes -v -l

> /usr/local/lib/python2.6/dist-packages/pelican-2.6.0-py2.6.egg/pelican/themes/notmyidea  
> /usr/local/lib/python2.6/dist-packages/pelican-2.6.0-py2.6.egg/pelican/themes/two-column (symbolic link to `/home/skami/Dev/Python/pelican-themes/two-column')  
> /usr/local/lib/python2.6/dist-packages/pelican-2.6.0-py2.6.egg/pelican/themes/simple  

###安装主题

你可以使用 `-i` 或 `--install` 选项来安装一个或多个主题。这个选项需要你想安装的主题的目录作为参数，而且可以与 `--verbose` 或 `-v` 选项结合使用。

    # pelican-themes --install ~/Dev/Python/pelican-themes/notmyidea-cms --verbose

    # pelican-themes --install ~/Dev/Python/pelican-themes/notmyidea-cms\
                               ~/Dev/Python/pelican-themes/martyalchin \
                               --verbose

    # pelican-themes -vi ~/Dev/Python/pelican-themes/two-column

###卸载主题

 `pelican-themes` 命令还可以卸载安装在pelican主题目录中的主题。使用 `-r` 或 `-remove` 选项并提供要卸载的主题名字作为参数来卸载一个或多个主题，该选项也可以与 `--verbose` 或 `-v` 选项结合使用。

    # pelican-themes --remove two-column

</pre>

    # pelican-themes -r martyachin notmyidea-cmd -v

###创建符号链接

 `pelican-themes` 可以通过创建符号链接来安装主题，这样就不需要将需要安装的主题整个复制到pelican主题的目录下。

你可以用 `-s` 或 `-symlink` 选项来对一个主题进行符号链接，这样安装的主题使用起来与用 `--install` 选项安装的主题没啥区别。

    # pelican-themes --symlink ~/Dev/Python/pelican-themes/two-column

本例中，`two-column` 这个主题被符号链接到了pelican主题目录，所以现在就能直接使用了，而且我们还能在调整这个主题的同时不需要反复重新安装它。

这对主题开发很有用。

    $ sudo pelican-themes -s ~/Dev/Python/pelican-themes/two-column
    $ pelican ~/Blog/content -o /tmp/out -t two-column
    $ firefox /tmp/out/index.html
    $ vim ~/Dev/Pelican/pelican-themes/two-coumn/static/css/main.css
    $ pelican ~/Blog/content -o /tmp/out -t two-column
    $ cp /tmp/bg.png ~/Dev/Pelican/pelican-themes/two-coumn/static/img/bg.png
    $ pelican ~/Blog/content -o /tmp/out -t two-column
    $ vim ~/Dev/Pelican/pelican-themes/two-coumn/templates/index.html
    $ pelican ~/Blog/content -o /tmp/out -t two-column

###在一条命令中执行多个操作

`--install` , `--remove` 和 `--symlink` 选项不是互斥的，所以你可以在一条命令中把它们结合起来，从而在一条命令中干更多的事情。像这样：

    # pelican-themes --remove notmyidea-cms two-column \
                     --install ~/Dev/Python/pelican-themes/notmyidea-cms-fr \
                     --symlink ~/Dev/Python/pelican-themes/two-column \
                     --verbose

在这个例子中，主题 `notmyidea-cms` 被 `notmyidea-cms-fr`替代了。

##参见

- [http://docs.notmyidea.org/alexis/pelican/](http://docs.notmyidea.org/alexis/pelican/)
- `/usr/share/doc/pelican/` 如果你用 [APT repository](http://skami18.github.com/pelican-packages/) 安装了Pelican
- 原版文档：[http://docs.getpelican.com/en/latest/pelican-themes.html](http://docs.getpelican.com/en/latest/pelican-themes.html 'pelican-themes documentation')