---
date: 2013-10-08
title: 纯CSS制作tooltip
tags: [CSS]
category: Web
---

![][demo-pure-css-tooltip-capture]

[VIEW DEMO][demo-pure-css-tooltip]

tootip 这个东西，真是什么地方都用得着，这段时间就不可避免的遇到了。

首先考虑一下 tooltip 的基本表现：

> 移动到某个元素上就会弹出的元素

这应该是最简单的 tooltip 了。

首先是移动到某个元素上触发效果，这里想必会用到`:hover`伪类。但是对其作出反应的却是另外一个元素，这里就需要实现一个联动的效果，最简单的方法，那就是嵌套咯，用外层元素做容器，使用`:hover`伪类派生的方法来让容器内部的元素也发生变化，在这儿就是让 tooltip 显示出来喽～

于是，就先来弄几个个自带容器的 tooltip 吧。

HTML:

    <div class="tooltip-wrapper">
        <span><a href="#">AB</a><span class="tooltip">Angel Beats!</span></span>
        <span><a href="#">SAO</a><span class="tooltip">Sword Art Online</span></span>
        <span><a href="#">GTO</a><span class="tooltip">Great Teacher Onizuka</span></span>
        <span><a href="#">TRC</a><span class="tooltip">Tsubasa Reservoir Chronicle</span></span>
        <span><a href="#">D.C.</a><span class="tooltip">Da Capo</span></span>
    </div>

接下来就是关键的 CSS 了,有这几个关键的地方：

-   一般情况下 tooltip 是不应该显示出来的，所以最简单的就是将它的透明度设置为 0（`opacity:0;`）。
-   对于 tooltip 的定位，在这个演示里面 tooltip 在其容器的正上方出现，为了给 tooltip 设置相对于容器的定位，将它的父元素设置为相对定位（`position:relative;`）。
-   在 tooltip 的父元素处于光标下的时候让 tooltip 显示出来，这个样式就通过父元素的`:hover`伪类派生来设定。
-   为了让 tooltip 的出现来得和谐点，给它加个`transition`。

CSS:

    .tooltip-wrapper{
        margin:5em 2em;
        font-size:24px;
    }

    /*Normal State*/

    .tooltip-wrapper>span{
        position:relative;
        display:inline-block;
        height:3em;
        width:3em;
        margin:0 0.4em;
        line-height:3em;
        text-align:center;
        font-weight:600;

        color:white;
        background:rgba(204,153,255,0.8);
        border: 6px solid rgba(223,191,255,0.8);
        border-radius:3em;
        box-shadow:0 0 5px rgba(223,191,255,0.8);
    }
    .tooltip{
        position:absolute;
        top:0;
        left:-25%;

        width:5em;
        line-height:1em;
        font-size:16px;
        text-align:center;
        padding:0.3em 0.5em;

        color:snow;
        background:#bbb;
        border:2px solid rgba(147,126,168,0.8);
        border-radius:3px;

        opacity:0;
    }

    /*Active State*/

    .tooltip-wrapper>span:hover{
        color:rgba(133,101,168,0.8);
        background:rgba(255,255,255,0.8);
        border:6px solid rgba(135,101,168,0.8);
        border-radius:3em;
        box-shadow:0 0 20px rgba(223,191,255,0.8);

        transition:all 0.2s ease-in-out;
    }
    .tooltip-wrapper>span:hover .tooltip{
        top:-5em;

        border-radius:5px;

        opacity:1;
        transition:all 0.2s ease-in-out;
    }

[demo-pure-css-tooltip-capture]: ../../static/image/demo-pure-css-tooltip.jpg
[demo-pure-css-tooltip]: http://frantic1048.com/pages/demo-pure-css-tooltip/demo-pure-css-tooltip.html 'View Demo'
