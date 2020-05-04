---
date: 2013-07-12
title: '[译]如何为pelican制作主题（无限修订中）'
tags: [Blog, Pelican, Translation]
category: Translation
---

好吧，要做主题，这才是真正开始。

翻译的时候好多地方都不知道怎么表达，望大神指点。

# 如何为 Pelican 制作主题

Pelican 使用著名的 [Jinja2][] 模板引擎来生成它的 HTML 输出。Jinja2 的语法非常简单。如果你想要制作你自己的主题，随意看看 [“simple”主题][simple-theme] 或许能给你一些灵感。

##主题的结构

制作主题时，你必须遵守下列结构

    ├──── static
    │   ├── css
    │   └── images
    └──── templates
        ├── archives.html // 用来显示文章存档
        ├── period_archives.html  //用来显示根据时间段划分的文章存档
        ├── article.html  // 用来处理每篇文章的页面
        ├── author.html   // 用来处理各个作者的页面
        ├── authors.html  // 必须列出所有作者
        ├── categories.html   // 必须列出所有目录
        ├── category.html // 用来处理各个目录
        ├── index.html// Index页面，列出所有文章
        ├── page.html // 用来处理每个page
        ├── tag.html  // 用来处理每个标签
        └── tags.html // 必须列出所有标签，可以是标签云

-   *static*包含了所有的静态文件，最后会被复制到输出中的*theme*目录下。我把 CSS 和 image 目录放在了这里，不过这只是举例，把你需要的东西放在这里。
-   _templates_ 包含了所有被用来生成页面的模板。我只在这里存放了必需的模板，你可以自己定义对你来说有用的模板。

## 模板与变量

我们的想法是使用可以嵌入进 HTML 的简单语法。这个文件描述了哪些模板存在于主题中，哪些变量将会在生成时被传递给每个模板。

所有的模板都会接收到你在设置文件中定义的全部大写的变量。你可以直接访问这些变量。

### 公共变量

这些设置对所有模板都有效。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>output_file</td><td>正在生成的文件的名字。举个例子，Pelican渲染主页的时候，output_file将会是“index.html”.</td></tr>
<tr><td>articles</td><td>文章列表，依日期降序排列所有类型为<em>Aritcle</em>对象的元素，你可以访问它们的属性（比如标题，概要，作者…）。有时会被屏蔽（例如在tags页面中）。你可以在变量<em>all_articles </em>中找到关于它的信息。</td></tr>
<tr><td>dates</td><td>同样是文章列表，不过是依日期升序排列。</td></tr>
<tr><td>tags</td><td>一个包含数个(tag,articles)元组的列表。包含了所有的标签和使用特定标签的所有文章的列表构成的元组。</td></tr>
<tr><td>categories</td><td>一个包含数个(category,articles)元组的列表。包含了所有分类和在特定分类下所有文章的列表构成的元组。</td></tr>
<tr><td>pages</td><td>pages的列表</td></tr>
</table>

### 排序

URL wrappers (currently categories, tags, and authors), have comparison methods that allow them to be easily sorted by name:

    {% for tag, articles in tags|sort %}

如果你想依照其它标准进行排序, [Jinja 的 sort 命令][jinja sort command] 拥有很多选项。

### 日期格式化

Pelican 依据你的设置和区域(`DATE_FORMATS`/`DEFAULT_DATE_FORMAT`)来提供一个`locale_date`属性。另一方面，`date`属性蒋成为一个`datetime`对象。如果你需要与当前设置不同的日期格式，使用 Pelican 自带的 Jinja 过滤器`strftime`，用法和 Python 中的 [strftime][] 是一样的，过滤器会正确地根据你设置的区域正确地对日期进行格式化。

    {{ article.date|strftime('%d %B %Y') }}

### index.html

这是博客的主页，生成到 output/index.html 。

如果启用了分页，后续的页面会被保存在 output/index\`n\`.html 。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>articles_paginator</td><td>一个用来处理文章列表的paginator对象</td></tr>
<tr><td>articles_page</td><td>文章列表的当前页面</td></tr>
<tr><td>dates_paginator</td><td>一个用来处理文章的paginator对象，依照日期升序进行排序</td></tr>
<tr><td>dates_page</td><td>文章列表的当前页面，依照日期升序排列</td></tr>
<tr><td>page_name</td><td>“索引” - 很有用的分页链接</td></tr>
</table>

### author.html

这个模板将用来处理每个作者的页面，输出为 output/author/_author_name_.html。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>author</td><td>作者名</td></tr>
<tr><td>articles</td><td>该作者的文章</td></tr>
<tr><td>dates</td><td>该作者的文章，依日期升序排序</td></tr>
<tr><td>articles_paginator</td><td>一个用于文章列表的paginator对象</td></tr>
<tr><td>articles_page</td><td>文章的当前页</td></tr>
<tr><td>dates_paginator</td><td>一个用于文章列表的paginator对象，依日期升序排序/td></tr>
<tr><td>dates_page</td><td>文章的当前页，依日期升序排序</td></tr>
<tr><td>page_name</td><td>AUTHOR_URL：在{slug}后面的一切都被去掉了 - 对分页链接很有用</td></tr>
</table>

### category.html

这个模板会用来处理每个分类，输出为 output/category/_category_name_.html。

如果启用了分页，后续的页面将依照 CATEGORY*SAVE_AS(默认值: output/category/\_category_name*’n’.html)输出。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>category</td><td>目录名</td></tr>
<tr><td>articles</td><td>该目录的文章</td></tr>
<tr><td>dates</td><td>该目录的文章，按日期升序排列</td></tr>
<tr><td>articles_paginator</td><td>一个文章列表的paginator对象</td></tr>
<tr><td>articles_page</td><td>文章的当前页</td></tr>
<tr><td>dates_paginator</td><td>一个文章列表的paginator对象，按日期升序排列</td></tr>
<tr><td>dates_page</td><td>文章当前页，按日期升序排列</td></tr>
<tr><td>page_name</td><td>CATEGORY\_URL:在{slug}后面的一切都被去掉了 - 对分页链接很有用</td></tr>
</table>

### article.html

这个模板用来处理每篇文章，输出为 output/_article_name_.html。这里是它特有的变量。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>article</td><td>要被显示的article对象</td></tr>
<tr><td>category</td><td>当前文章所属分类的名称</td></tr>
</table>

### page.html

这个模板用来处理每个 page 页面，相应输出为 output/_page_name_.html。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>page</td><td>要显示的page对象，你可以访问它的标题，slug和内容</td></tr>
</table>

### tag.html

这个模板用来处理各个标签，相应的输出为 output/tag/_tag_name_.html。

如果启用了分页，后续的页面将依照 TAG*SAVE_AS(默认值: output/tag/\_tag_name*’n’.html)输出。

<table border-collapse=collapse>
<tr><th>变量</th><th>描述</th></tr>
<tr><td>tag</td><td>标签名</td></tr>
<tr><td>articles</td><td>与该标签相关的文章</td></tr>
<tr><td>dates</td><td>与该标签相关的文章，依照日期升序排序</td></tr>
<tr><td>articles_paginator</td><td>一个文章列表的paginator对象</td></tr>
<tr><td>articles_page</td><td>文章当前所在页</td></tr>
<tr><td>dates_paginator</td><td>一个文章列表的paginator对象，依照日期升序排序</td></tr>
<tr><td>dates_page</td><td>文章当前所在页，依照日期升序排序</td></tr>
<tr><td>page_name</td><td>TAG_URL：在{slug}后面的一切都被去掉了 - 对分页链接很有用</td></tr>
</table>

## Feeds

feed 变量在 3.0 版本(译者注：指 Pelican，下同)中有所改变，现在每个变量在名字中显式列出是 ATOM 还是 RSS。ATOM 依然是默认的。旧主题可能因此需要更新。下面是所有的 feed 变量

-   FEED_ATOM
-   FEED_RSS
-   FEED_ALL_ATOM
-   FEED_ALL_RSS
-   CATEGORY_FEED_ATOM
-   CATEGORY_FEED_RSS
-   TAG_FEED_ATOM
-   TAG_FEED_RSS
-   TRANSLATION_FEED_ATOM
-   TRANSLATION_FEED_RSS

## 继承

自从 3.0 版本开始，Pelican 支持继承`simlpe`主题，你可以在你的主题里面重用`simple`主题中的模板。

如果你的`templates/`目录下的某个**必需模板**丢失了，它将被`simple`主题中的对应模板替代。因此，如果`simple`主题中的模板的 HTML 结构是适合你的，你就不需要从头写一个全新的模板。

你也可以在你的主题中对`simple`主题的模板进行扩展，像下面这个例子中一样使用`{% extends %}`来实现。

    {% extends "!simple/index.html" %}   <!-- extends the ``index.html`` template from the ``simple`` theme -->

    {% extends "index.html" %}   <!-- "regular" extending -->

### 例子

通过这个机制，你可以仅仅用两个文件来创建一个主题。

### base.html

第一个文件是`templates/base.html`模板：

    {% extends "!simple/base.html" %}

    {% block head %}
    {{ super() }}
       <link rel="stylesheet" type="text/css" href="{{ SITEURL }}/theme/css/style.css" />
    {% endblock %}

1. 在第一行，我们扩展了`simple`主题中的`base.html`，所以我们不需要重写整个文件。
2. 第三行，我们开始了在 simple 主题中定义好的 `head` 块。
3. 第四行，`super()` 函数保持先前插入的`head` 块不结束。
4. 第五行，我们为页面添加了一个样式表。
5. 最后一行，我们结束了`head` 块。

这个文件将被所有其它的模板（译者注：tags.html，articles.html…）扩展，所以样式表会被连接到所有页面中。

### style.css

第二个文件就是`static/css/style.css`CSS 样式表：

    body {
        font-family : monospace ;
        font-size : 100% ;
        background-color : white ;
        color : #111 ;
        width : 80% ;
        min-width : 400px ;
        min-height : 200px ;
        padding : 1em ;
        margin : 5% 10% ;
        border : thin solid gray ;
        border-radius : 5px ;
        display : block ;
    }

    a:link    { color : blue ; text-decoration : none ;      }
    a:hover   { color : blue ; text-decoration : underline ; }
    a:visited { color : blue ;                               }

    h1 a { color : inherit !important }
    h2 a { color : inherit !important }
    h3 a { color : inherit !important }
    h4 a { color : inherit !important }
    h5 a { color : inherit !important }
    h6 a { color : inherit !important }

    pre {
        margin : 2em 1em 2em 4em ;
    }

    #menu li {
        display : inline ;
    }

    #post-list {
        margin-bottom : 1em ;
        margin-top : 1em ;
    }

### 下载

你可以从[这里][example-theme]下载这个样例主题

### 源文档

原文链接：[http://docs.getpelican.com/en/latest/themes.html](http://docs.getpelican.com/en/latest/themes.html 'original-page')

[jinja2]: http://jinja.pocoo.org/
[simple-theme]: https://github.com/getpelican/pelican/tree/master/pelican/themes/simple/templates ' “simple” theme '
[jinja sort command]: http://jinja.pocoo.org/docs/templates/#sort 'Jinja’s sort command '
[strftime]: http://docs.python.org/2/library/datetime.html#strftime-strptime-behavior
[example-theme]: http://docs.getpelican.com/en/latest/_downloads/theme-basic.zip
