---
date: 2013-06-19
title: 博客诞生记:基于GitHub+Pelican创建博客的整个过程
tags: [Life, Blog, Pelican, Github]
category: Blog
---

很早以前就想搭建一个独立博客，一点点的记录生活与学习，说到底，还不是因为托管博客的限制颇多，编辑体验太差 +\_+
本文记录了我建立博客的基本过程，希望能对想要建博客却跟我一样完全不懂 web 的小白有所帮助。

阅读本文所需技能：

-   脑补精通 Lv1：脑补基础
-   举一反三 Lv1：举一反三分之一
-   英文掌握 Lv2：字母精通
-   Linux 掌握 Lv1：会开终端

在谋划阶段，看了不少关于建博的路子，最后图简单我选择了用 Pelican 在 GitHub 上搭建博客的路子。

整个过程所在平台：[Chakra Linux][]，Pelican 版本：3.2.0

---

# 过程概要

1. 在[Github][]上创建工程
2. 安装配置 pelican 和 git，以及准备工作
3. 开始写博客

---

# 详细步骤 ##在 GitHub 上创建工程

如果你还没有[GitHub][]账户，去注册一个~

登录 GitHub，点击页面顶部的显示你用户名位置右边的*创建新工程* `(Create a new repo)` 按钮，来到创建新工程页面

![][create-a-new-repo]

建立一个名为`xxx.github.com`的工程，这里我用的是 frantic1048，我已经创建好了，所以提示已存在。

![][create-a-new-repo2]

填写好工程名后，点击下方的*创建工程*`（Create repository）`按钮。

接下来进入项目的设置页面，在`GitHub Pages`这栏（我因为已经创建过页面了所以有提示"Your site is published at ......"），点击`Automatic Page Generator`，接下来几步一路`continue`就可以了，因为生成的页面在随后会被清空。

![][auto-generator]

这步完成之后，通过`http://xxx.github.com/`或者`http://xxx.github.io/`就可以访问生成的页面了，如果你遇到 404 错误，别着急，第一次生成完大概十来分钟才能看到页面，这个时候先来看下一步吧。

## 安装配置 pelican 和 git，以及准备工作

**pelican 的安装**:根据 pelican 官方的推荐，我使用 pip 安装，而 pip 的安装又依赖 distribute,整合 3 方的安装指南，我使用的终端命令如下：

    curl -O http://python-distribute.org/distribute_setup.py
    sudo python distribute_setup.py

    curl -O https://raw.github.com/pypa/pip/master/contrib/get-pip.py
    sudo python get-pip.py

    sudo pip install pelican

**git 的安装**：因为 git 本身在软件源中，直接用 Chakra 的软件包管理器 pacman 安装即可：

    sudo pacman -S git

**配置 git**：参考了 GitHub 的配置指南，设置好用户名和邮箱（这里的邮箱用的是你注册 GitHub 的那个邮箱）

    git config --global user.name "Your Name Here"
    git config --global user.email "your_email@example.com"
    git config --global push.default simple

**安装 ssh 公钥**:用你在注册 github 时用的 Email 生成一个 ssh 公钥私钥对:

    ssh-keygen -t rsa -C "your_email@example.com"

> Enter passphrase (empty for no passphrase): _输入你在 github 注册时使用的密码_  
> Enter same passphrase again: _再输一次_

然后会看到公钥和私钥分别被保存为`id_rsa`和`id_rsa.pub`，后者正是我们需要的。打开 github 网页，在账户设置`（Account settings）`中找到*SSH keys*项目，点击*添加 SSH key*`(Add SSH key)`，把`idrsa.pub`中的内容复制到网页中的 key 里面。现在回到终端测试一下

    ssh -T git@github.com

> The authenticity of host 'github.com (204.232.175.90)' can't be established.  
> RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.  
> Are you sure you want to continue connecting (yes/no)?  
> Hi _username_! You've successfully authenticated, but GitHub does not provide shell access.

看到这个内容的时候，就说明成功了，git 配置至此完毕。

现在在你的电脑上创建一个 blog 目录，用来存放你的博客文件(我这里目录名直接用的“blog”)

    mkdir blog
    cd blog

用 pelican 创建一个博客,按照提示一步一步进行，之后还可以在`pelicanconf.py`这个文件中修改配置

    pelican-quickstart

> Where do you want to create your new web site? [.]（你想在哪里创建你的网站，默认为当前目录）  
> What will be the title of this web site?（网站的标题是）  
> Who will be the author of this web site?（网站的作者是）  
> What will be the default language of this web site? [en]（网站的语言是），当然是中文啦，填‘zh’  
> Do you want to specify a URL prefix? e.g., http://example.com (Y/n) （是否指定域名），Y  
> What is your URL prefix? (see above example; no trailing slash) （输入域名，不能包含反斜杠‘/’），http://frantic1048.github.io  
> Do you want to enable article pagination?（是否启用文章分页）  
> Do you want to generate a Makefile to easily manage your website?（是否生成一个 Makefile 来管理网站）  
> Do you want an auto-reload & simpleHTTP script to assist with theme and site development?（是否想有一个自动加载的小型 http 脚本用来修改主题和站点开发）  
> Do you want to upload your website using FTP?  
> Do you want to upload your website using SSH?  
> Do you want to upload your website using Dropbox?  
> Do you want to upload your website using S3?

这个时候你会看到`blog`目录下多了几个 Pelican 生成的文件，其中的`pelicanconf.py`就是配置文件

把你的项目 clone 到 blog 这个文件夹下面,并进入这个目录，这里我的项目文件夹为“frantic1048.github.com”

    cd blog
    git clone https://github.com/frantic1048/frantic1048.github.com
    cd frantic1048.github.com

清空项目文件（因为之前使用`Automatic Page Generator`创建出来了一堆不需要的东西）:

    git rm -rf .
    git checkout --orphan gh-pages

## 开始写博客

现在，就可以用 Pelican 开始写博客了，具体怎么写可参看[Pelican 的文档][pelican doc]，这里我用 Markdown 举例。

进入 content 目录，用编辑器创建一个文件，写入博客内容并保存为 md 文件：

> date: 2013-06-06 #日期  
> title: My Super Beginng #标题  
> tags: Writing, Life #标签  
> category: Life #分类  
> 文章内容

写好之后，回到 blog 目录，将 md 文件翻译成 html 静态页面：

    cd blog
    make html

> [ ! -d /home/frantic/blog/output ] || find /home/frantic/blog/output -mindepth 1 -delete  
> pelican /home/frantic/blog/content -o /home/frantic/blog/output -s /home/frantic/blog/pelicanconf.py  
> Done: Processed 1 articles and 0 pages in 0.32 seconds.

你还可以用这条命令编译：

    pelican content

注意，如果你在这里遇到类似下面这样的错误信息，请检查一下你是否安装了 markdown（我就是因为这个奇葩的错误提示闹腾了一个多小时），至于为什么这个提示的原因可能会是没安装 markdown，参看这里的[吐槽][tucao]

> WARNING: Could not process /home/frantic/blog/content/First.md  
> 'bool' object is not callable

现在把生成的页面复制到`xxx.github.com`目录下，接下来就是上传啦！

进入`xxx.github.com`目录，提交文章到 github：

    cd ~/blog/frantic1048.github.com
    git add .
    git commit -m "first blog"
    git push

过一会儿之后，再访问`xxx.github.com`,就能够看到你的博客诞生了！

如果你有域名的话，还可以进行域名绑定，在 github 的项目根目录下创建一个名为“CNAME”的文件，在里面写入你的域名（比如我写的是`frantic1048.com`）,然后 push 到 github，之后进入你的域名服务商那边去，把你的域名对应的 ip 改成 username.github.com 对因的 ip 即可（比如我就填写的 frantic1048.github.com 对应的 ip）接下来就可以用你的域名来访问你的博客了，有的域名服务器可能要过段时间才可以，我的是 1 分钟不到就能够访问了

# 后续：

## 更改主题

Pelican 本身提供了不少主题，同时也支持自己制作主题，你可以直接把 github 上 pelican 的主题全都 clone 下来

    git clone git://github.com/getpelican/pelican-themes.git

在里面找到一个你喜欢的主题，假如这个主题的目录是 `~/pelican-themes/bootstrap2` ，使用 pelican-themes 安装这个主题

    sudo pelican-themes -i  ~/pelican-themes/bootstrap2

随后就可以用`pelican-themes`查看已安装的主题

    pelican-themes --list --verbose

> /usr/lib/python2.7/site-packages/pelican/themes/bootstrap2  
> /usr/lib/python2.7/site-packages/pelican/themes/notmyidea  
> /usr/lib/python2.7/site-packages/pelican/themes/simple

要在你的博客中使用安装好的主题，直接在 pelicanconf.py 文件中修改或者添加`THEME`项为想要的主题名,例如

> THEME = "bootstrap2"

然后执行

    make html

重新生成的页面现在使用的就是新指定的主题了

## 使用插件

Pelican 一开始是将插件内置的, 但是新版本 Pelican 将插件隔离了出来, 所以我们要到 github 上 克隆一份新的插件, 在博客目录执行

    git clone git://github.com/getpelican/pelican-plugins.git

现在我们博客目录就新添了一个 pelican-plugins 目录, 我们以配置 sitemap 插件为例,sitemap 插件可以生成 sitemap.xml 供搜索引擎使用

在 pelicanconf.py 配置文件里加上如下项:

> PLUGIN_PATH = u"pelican-plugins"  
> PLUGINS = ["sitemap"]

配置 sitemap 插件

> SITEMAP = { "format": "xml", "priorities": { "articles": 0.7, "indexes": 0.5, "pages": 0.3, }, "changefreqs": { "articles": "monthly", "indexes": "daily", "pages": "monthly", }}

然后再执行

    make html

就搞定了

## 添加评论支持

Pelican 使用 Disqus 评论, 可以在 Disqus 上申请一个站点, 然后在 pelicanconf.py 里添加或修改"DISQUS_SITENAME"项的内容为你的 Disqus ID :

> DISQUS_SITENAME = u"frantic1048"

然后执行

    make html

## 拷贝静态文件

如果我们定义静态的文件, 该如何将它在每次生成的时候拷贝到 output 目录呢, 我们以 robots.txt 为例, 在我们的 content/extra 下面我们放了一个定义好的 robots.txt 文件, 在 pelicanconf.py 更改或添加`FILES_TO_COPY`项:

> FILES_TO_COPY = ( ("extra/robots.txt", "robots.txt"),)

这样在每次生成 html 的时候都会把 content/extra 下的 robots.txt 拷贝到 output 目录下。

## 拷贝静态目录

如果是一个静态目录呢?比如有个名为`img`的目录用来放文章所使用的图片，我们可以在 pelicanconf.py 里添加或修改`STATIC_PATHS`项：

> STATIC_PATHS = [u"img"]

然后执行

    make html

然后 Pelican 就会将`img`目录拷贝到`output/static/`下就大功告成了。

[chakra linux]: http://www.chakra-linux.org/
[github]: https://github.com/
[pelican doc]: http://docs.getpelican.com/en/3.1.1/
[tucao]: https://github.com/getpelican/pelican/issues/876/
[create-a-new-repo]: ../static/image/create-a-new-repo.jpg
[create-a-new-repo2]: ../static/image/craate-a-new-repo2.jpg
[auto-generator]: ../static/image/auto-generator.jpg
