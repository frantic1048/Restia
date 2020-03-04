---
title: 在 Gatsby 上使用 Typestyle
date: 2020-03-05
tags:
    - Blog
    - Gatsby
    - Typestyle
category: Blog
---

最近终于又开始动手继续糊博客了，思量一番觉得 Gatsby 还比较符合需要就摸起来了，想着写点样式的时候发现 Typestyle 要科学跑起来还有点问题于是有了这篇记录。主要问题的点还是 Gatsby 静态渲染之后，实际页面加载的时候显示效果不理想的问题。

最开始的情况，用着 Typestyle，忘记配 SSR：

```tsx
import { style } from 'typestyle'

const awesomeHeaderClassName = style({
    fontStyle: 'italic',
    background: 'aqua',
})

export default MyPyonPyonPage = () => <h1 className={awesomeHeaderClassName}>My awesome header</h1>
```

实际部署后，会看到页面在 JS 跑起来之前（准确来说是客户端的 Typestyle 已经跑起来之前），并看不自己设定的样式。看一眼 Gatsby build 出来的文件，噢，一行 CSS 都没得。

看一眼 Typestyle 文档[^1]，已经说得很清楚 SSR 的时候要做的操作了：

1. SSR 的时候把 CSS 写到渲染的 HTML 里去。
2. 在客户端 ReactDOM 渲染完 **之后** 调用 `typestyle.setStylesTarget` 让 Typestyle 复用 SSR 输出 CSS 的那个 style 元素。

可惜 Gatsby 封装比较高级，一时我连 `ReactDOM.render()` 都没找到在哪里跑的 ˊ\_>ˋ。不过略费劲地翻了一通 API 文档还是给找到姿势了。

# 第一步：在 SSR 阶段写入 Typestyle 的 CSS

根据 Gatsby 文档，`onPreRenderHTML`[^2] 是正好需要的 API，它的执行时机是 Gatsby 跑完 HTML 渲染之后（这个很重要，如果是渲染前的话，Typestyle 的 `getStyles` 是不会吐东西出来的），可以用来对渲染出来的东西进一步调整。

这里就一把梭整个 style 标签写 Typestyle 的 CSS 插 `<head>` 里了：

```js
// gatsby-ssr.js
import * as React from 'react'
import { getStyles } from 'typestyle'

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }, { styleTargetId = defaultStyleId }) => {
    replaceHeadComponents([
        ...getHeadComponents(),
        React.createElement('style', {
            key: 'hohoho',
            id: 'hohoho',
            dangerouslySetInnerHTML: { __html: getStyles() },
        }),
    ])
}
```

嗯？`'hohoho'`？~~这是用来在圣诞节的时候生成特殊美妙样式的一种暗号~~，只是一个普通的用作 id attribute 的标识符，随便取啥都行（注意别和页面别的元素撞名了），只是后面第二步会用到。

现在跑一波构建，已经能看到 CSS 成功写入 HTML 里了。

# 第二步：在客户端 ReactDOM 渲染完 **之后** 调用 `typestyle.setStylesTarget` 让 Typestyle 复用 SSR 输出 CSS 的那个 style 元素

按照 Typestyle 文档来说，需要在客户端 ReactDOM 渲染完后跑这样一段逻辑：

```ts
const styleTarget = document.getElementById('hohoho')
setStylesTarget(styleTarget)
```

这里的 `'hohoho'` 就是 SSR 部分设定的用来渲染 Typestyle CSS 的 style 标签的 id。其实和前面不一致问题也不太大，只是 Typestyle 会开个新 style 标签来写样式，导致一坨不受控的 CSS 会在关闭页面前一直存在，可能某天就坑了。

一开始尝试找 Gatsby 调用 ReactDOM 的地方看能不能自定义掉，后来发现 Gatsby 已经给了 API 用在客户端跑 React 组件之外的脚本了，不过得小心点选择正确的 API，比如 `onClientEntry`[^3]，这玩意儿会把提供的回调函数在客户端渲染前执行，用这个去跑 `typestyle.setStylesTarget` 会导致

1.  页面一开始有样式：静态页面我们已经有 CSS 了。
2.  然后样式突然没了：ReactDOM 渲染前，`typestyle.setStylesTarget` 会立即[^4]把当前已经生成的 CSS 写入新指定的 styles target，这时候 React 还没跑起来，当前的 CSS 是空的，结果是静态页面的那个 style 标签被清空了。
3.  然后又突然有样式了：ReactDOM 跑完了，Typestyle 该生成的 CSS 都生成了。

仔细看半天说明，找到需要的 API 是 `onInitialClientRender`[^5]，这个才是渲染后跑，而且只跑一次回调。复制粘贴组合一下文档的 example 和前面要执行的逻辑就是需要的代码了：

```ts
// gatsby-browser.js
import { setStylesTarget } from 'typestyle'

export const onInitialClientRender = () => {
    let styleTarget = document.getElementById('hohoho')
    if (!styleTarget) {
        // 为了以防万一，还是多处理了一下元素没找到的 case，理论上应该不会遇到（
        const newStyleEl = document.createElement('style')
        newStyleEl.setAttribute('id', 'hohoho')
        styleTarget = document.head.appendChild(newStyleEl)
    }
    setStylesTarget(styleTarget)
}
```

这样，页面从加载 HTML 到 React 跑起来，全程就不会掉样式了（对，就为了这个）。

# 后话

不得不说 Gatsby 的插件 API 还是比较科学，可以很轻松（复制粘贴三板斧）地把一部分配置给抽离成插件，管理起来也挺舒服的，比如 [本博客的操作](https://github.com/frantic1048/Restia/blob/bd83d8b3ffd8f1460f3da6a9b26b9e79760ff8e0/plugins/gatsby-plugin-typestyle/) 。

~~哈哈哈哈呼呼成功把几行破事水一篇了~~

[^1]: Typestyle SSR 文档： https://typestyle.github.io/#/server
[^2]: onPreRenderHTML API：https://www.gatsbyjs.org/docs/ssr-apis/#onPreRenderHTML
[^3]: onClientEntry API：https://www.gatsbyjs.org/docs/browser-apis/#onClientEntry
[^4]: Typestyle 的 setStylesTarget 实现：https://github.com/typestyle/typestyle/blob/f8cd6a01ab005efc638937615b87cbe9e562c8dd/src/internal/typestyle.ts#L195
[^5]: onInitialClientRender API：https://www.gatsbyjs.org/docs/browser-apis/#onInitialClientRender
