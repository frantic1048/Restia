---
date: 2013-06-17
title: Windows下安装和使用Pelican
tags: [Blog, Life, Pelican, Windows]
category: Blog
---

最近几天尝试在 Windows 上面使用 Pelican，刚开始也是直接想用 pip 安装，不料不少 pelican 依赖的包都没能下载。最后只好手动安装了这些没能自动装上的包。悲催的过程就不提了，就把需要手动安装的包列表记在这儿了：

-   [blinker][blinker]
-   [docutils][docutils]
-   [feedgenerator][feedgenerator]
-   [jinja2][jinja2]
-   [markdown][markdown]
-   [pygments][pygments]
-   [pytz][pytz]
-   [setuptools][setuptools]
-   [pelican][pelican]

[blinker]: https://pypi.python.org/pypi/blinker
[docutils]: https://pypi.python.org/pypi/docutils
[feedgenerator]: https://pypi.python.org/pypi/feedgenerator
[jinja2]: https://pypi.python.org/pypi/Jinja2
[markdown]: https://pypi.python.org/pypi/Markdown
[pygments]: https://pypi.python.org/pypi/Pygments
[pytz]: https://pypi.python.org/pypi/pytz
[setuptools]: https://pypi.python.org/pypi/setuptools
[pelican]: https://pypi.python.org/pypi/pelican

一起下载下来解压到同一个文件夹，写个简单的批处理就一并安装了。另外我还发现 Python3 运行 Pelican 有点问题，解决所有依赖关系后运行 pelican 会出现 [TypeError][type-error]，后来我另外安装了 Python2 去运行就没有发现问题，目前还没能找到原因。

[type-error]: http://stackoverflow.com/questions/17124129/cannot-import-name-signals-when-importing-pelican-on-windows 'Stack Overflow 上该问题的详细描述'

如果你发现你在命令行中键入 Pelican 提示找不到命令，检查一下 Python 安装目录下的*Scripts*子目录是否已经添加进了%Path%中。

如果你已经有 Pelican 搭建的博客了，_记得确保你所使用的博客主题也已经安装在电脑上_，否则 Pelican 会在编译的时候会出错，提示找不到主题。

在 Windows 下面使用 Pelican 感觉编译之前的等待时间多了不少。
