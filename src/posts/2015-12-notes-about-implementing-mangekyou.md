---
date: 2015-12-07
title: Mangekyou 开发小记
tags: [Javascript, Electron, React, Web Worker, Canvas]
category: Tech
---

最近搞数字图像处理作业，要求都要有图形界面，遂又用 Electron 搞了一发，可桌面可浏览器的感觉真的很爽呢。稍微记录下经验吧。

因为是数字图像，想着想着就脑洞到了万花筒写轮眼，于是项目就用 Mangekyou 做名字了（取个名字真是艰难）。

总览：

-   源代码：100% ES6
-   构建控制：Gulp
-   模块绑定：Webpack
-   架构：[Flux]（Facebook 的实现）
-   界面库：[React]
-   界面组件库：[Material UI]
-   测试：人形自走测试框架

# 读取和存放图片数据

为了让程序能够不用修改跑浏览器上，我没用 Node.js 的文件接口，而是用浏览器的 `<input>` 元素来做输入，很方便啊！自带 MIME 过滤，自带系统的文件对话框，省了好多事情，监听一下 `Change` 事件，然后用 [FileReader] 把图片数据读进来这个工作就完成啦～

关于存放数据，我最开始是解析成 [ImageData] 存放的，结果后面发现这玩意儿怎么用怎么别扭，而且 canvas 的 [putImageData()] 竟然比 [drawImage()] 少了俩参数，没了自动缩放的支持，而且[绘制还慢][slow_putimagedata]。而 canvas 很方便转换不说，还没那么慢，所以就开心用 canvas 来存放图像咯。

实现起来像这样子:

```jsx
<input type="file" multiple accept="image/*" onchange={handleFile} />
```

```js
function handleFile() {
    function extractDataAndDoSomething(f) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        const fr = new FileReader()
        img.onload = () => {
            canvas.setAttribute('width', img.width)
            canvas.setAttribute('height', img.height)
            ctx.drawImage(img, 0, 0)

            // store loaded image.
            storeMyImage(canvas)
        }
        fr.onload = () => {
            img.src = fr.result
        }
        fr.readAsDataURL(f)
    }
    for (const eachFile of new Array(...this.refs.fileInput.files)) {
        extractDataAndDoSomething(eachFile)
    }
}
```

# 用 canvas 而非 `<img>` 绘图

因为有实现一个历史列表，每项都有历史记录的小图，结果我就干出了用 `<img>` 去展示那堆小图的蠢事，我把 canvas 的数据转成 DataURL 赋值给 `<img>` 的 src 属性，因为 `<img>` 有自动调整图像显示大小的功能，然后发现历史列表更新时真是卡的可以，录了一下性能信息，发现更新历史列表要花个几千毫秒，其中 toDataURL() 耗费了巨量时间，结果后来手写缩放用 canvas 来绘图耗时直接缩短到几十毫秒 （´＿｀）。

# 正确使用 React 组件的 key 属性

用数组之类的东西动态生成一堆组件的时候，React 会提示要你提供一个 key 属性，这个是 React 用来标记每个组件谁是谁从而能正确处理更新的，这玩意儿没正确使用的话，就会有类似该更新的元素不更新一类的事情发生。另外得确保提供的 key 是和数据项一对一的，像一个变动的数组的下标就不适合做 key，因为不同的时候同一个下标值可能是不同的数据，结果就会造成界面那边更新的时候看起来和数据不一致，最好在存放成堆的数据的时候就给它们顺带打上个 key 属性，如果懒得想 key 怎么生成的问题，用 `performance.now()` 这家伙吧，它能在同一次会话输出增序的时间戳。

# 用 Generator 帮助遍历 ImageData

处理图像数据的时候经常有需要遍历像素的操作，时不时又跟坐标值相关，而 ImageData 里面的像素是个一维数组不说，还是 r, g, b, a 展开排列的，每次手写二重循环一点很是麻烦，这时 ES6 的 [Generator] 就派上用场啦～

比如写个获取图片所有像素的坐标和 ImageData 中的索引值的函数：

```js
function getAllPositions(width, height) {
    return function* pos() {
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                yield [x, y, y * width * 4 + x * 4]
            }
        }
    }
}
```

然后就可以用 `for...of` 直接遍历了：

```js
const allPos = getAllpositions(imageData.width, imageData.height)
for (const [x, y, index] of allPos()) {
    imageData.data[index] // Red
    imageData.data[index + 1] // Green
    imageData.data[index + 2] // Blue
    imageData.data[index + 3] // Alpha
}
```

# 在 Web Worker 里面使用 ES6 Module

为了避免卡界面太厉害，我把关于图像计算工作丢给了 [Web Workers][using web workers] 处理，使用的时候发现即使是 Electron 环境下，它也是没有 `require` 之类的模块相关功能，而只能用那个看起来很捉计的 `importScripts()` 来导入外部文件，不过有 webpack 在，把 worker 部分程序的入口文件交给 webpack 绑定一下，就可以在 worker 代码里面用 `import` 导入模块了，也避免了用 `importScripts()` 造成 ESLint 疯狂报变量未声明/未使用的警报。

具体的实现可参考 Mangekyou 的 [gulpfile 中的配置](https://github.com/frantic1048/mangekyou/blob/master/gulpfile.babel.js#L123-L128)与对应的 [worker 的代码](https://github.com/frantic1048/mangekyou/blob/master/src/app/script/worker/worker.js)的组织方式。

# 用 transferable objects 更快地传递 worker 的数据

默认的 postMessage() 是用的结构化拷贝的方式创了一个数据的副本传递到 worker/主线程的，想想都会有点费时间，另外有种方法是可以直接移交数据的所有权到另一个线程，从而少了一步复制，这样会让数据传递[更快一些][fast transferable]，jsPerf 上有对于这两个方式的[速度对比][perf transferable]，提升还是挺大的。

postMessage() 第二个参数是要移交的变量的数组，对于数组的话，只能移交 ArrayBuffer（可以通过数组的 `buffer` 属性获得），所以以 transferable object 的方式传递 ImageData 的数据是这个样子：

```js
self.postMessage(
    {
        width: image.width,
        height: image.height,
        buffer: image.data.buffer,
    },
    [image.data.buffer],
)
```

然后在接收数据的那端将其重新包装成 ImageData 进行后续操作：

```js
function onMessage({ data }) {
    const imgd = new ImageData(new Uint8ClampedArray(data.image.buffer), data.image.width, data.image.height)

    // do somthing with recived imageData~
}
```

# React 的 setState() 的奇怪的更新行为

原以为 setState() 是像 Object.assign() 类似的方式更新 state 的，结果又不完全是；最后发现是自己没仔细看 [`setState()` 的文档][setstate doc]，`shallow merge` 在那儿摆着 （´＿｀）

比如 state 原本是 `{kotori: 0, honoka: {x: 1, y: 2}}`。

`this.setState({kotori: 3})`没有什么问题，只有 `kotori` 被更新了，`honoka` 还是原来的值。

`this.setState({honoka: {x: 2}})` 的话，奇怪的就来了，`honoka`被整个替换成 `{x: 2}`，`y` 属性就这么飞了。

做这种更新的时候用 `Object.assign()` 之类的手段确保不会发生这样的意外，爆栈上也有介绍这个问题的[解决方案][stackoverflow shallow merge]

```js
this.setState({
    honoka: {
        ...this.state.honoka,
        x: 2,
    },
})
```

# canvas 用的颜色空间不像是 sRGB

在写 [Rec. 709] Luma 的计算的时候，找不到资料关于 canvas 到底用的什么颜色空间，因为 sRGB 在网页上是如此的通用，所以先写了带 [sRGB Gamma 校正][srgb transform]的灰度化算法，然后丢进 Krita 里面去发现并不科学，然后去掉 Gamma 校正之后就正确了，尝试了 Chromium 47.0.2526.73 (64-bit)
，Firefox 44.0a2 (2015-12-06) 结果均是如此，目前来看，直接把 canvas 里面的颜色值当线性 RGB 值处理就可以了。

# 用 `<a>` 标签触发浏览器下载

经过一番折腾，发现如果新创建 `<a>` 标签不插到 document 里面去的话，各种调整都无法保证 Electron、Chromium、Firefox 里面都能成功触发下载，最后尝试了插入 document 再模拟点击，才终于获得大统一 \_(:з」∠)\_：

```js
function handleExportImage() {
    const a = document.createElement('a')
    a.setAttribute('download', 'proceed.png')
    a.setAttribute('href', canvas.toDataURL())
    a.setAttribute('style', 'position: fixed; width: 0; height: 0;')

    const link = document.body.appendChild(a)
    link.click()
    document.body.removeChild(link)
}
```

噢对，Mangekyou 源代码传送：[https://github.com/frantic1048/mangekyou](https://github.com/frantic1048/mangekyou)

继续写 (ง •̀\_•́)ง

[flux]: https://facebook.github.io/flux/
[material ui]: http://material-ui.com/
[react]: https://facebook.github.io/react/
[filereader]: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[imagedata]: https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
[drawimage()]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
[putimagedata()]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
[slow_putimagedata]: http://stackoverflow.com/questions/3952856/why-is-putimagedata-so-slow
[generator]: http://exploringjs.com/es6/ch_generators.html
[using web workers]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[transferable objects]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Passing_data_by_transferring_ownership_%28transferable_objects%29
[fast transferable]: https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast
[perf transferable]: https://jsperf.com/web-workers-transferable-objects
[rec. 709]: https://en.wikipedia.org/wiki/Rec._709
[srgb transform]: https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
[stackoverflow shallow merge]: http://stackoverflow.com/questions/18933985/this-setstate-isnt-merging-states-as-i-would-expect
[setstate doc]: https://facebook.github.io/react/docs/component-api.html#setstate
