---
date: 2015-06-18
title: 制作点兔的 Telegram 贴纸集小记
tags: [Anime, Gochiusa, Telegram]
category: Misc
---

![sticker set preview](../../static/image/gochiusa___telegram_stickers_set_by_frantle_d8xqyvq-fullview.jpg)

Telegram 刚出贴纸功能的时候就想给做一个关于 [点兔][gochiusa] 的贴纸集了,因为考试迟迟没有动工，上周终于从动画截图中挑选了 100 多张图准备来做贴纸，扣了大概 10 多张之后在群里问了问，幸运的是 [Mika][mika] 来助力，三天帮我搞定了其中的 60 张，质量绝赞！前后快一个星期的时间最后出了 149 张贴纸 ！最后看到自己扣了这么多图也是感到不可思议，大概这就是爱得深沉吧 \_(:з」∠)\_ 随后段时间我会把原尺寸的 png 图包发到 DA 上去。同时记个创贴纸的流程～

贴纸集链接：[Gochiusa][sticker1], [Gochiusa2][sticker2]
DeviantArt 链接：[Gochiusa - telegram stickers set][da]

#创建贴纸集

向 [Stickers Bot][bot] 发送 `/newstickerpack`，随后它会提示你发送贴纸集的名字给它。

#上传贴纸

先发送 1 个或者多个符合当前贴纸内容的 emoji 过去，bot 的建议是不超过两个 emoji。

然后以文件的形式发送对应贴纸的 png 图。多张贴纸重复此步骤即可。

##注意

png 图片长宽需均小于等于 512px，且长边为 512px。

使用 [imagemagick][] 可以一键批量搞定：`mogrify -resize 512x512 -format png <your pictures>`

**批量操作之前一定要记得先备份！**我就是因为这个操作导致原尺寸的文件全被原地 resize 到 512px 了，现在得手动重做出原尺寸的大图 ˊ\_>ˋ

另外，单个 stickers set 的贴纸数量限制是 100（就这么轻易地触及上限了 \_(:з」∠)\_）

#发布贴纸

向 bot 发送 `/publish`，随后它会提示你发送贴纸的链接名过去，就是一个贴纸链接 `https://telegram.me/addstickers/` 之后连着的内容。

之后你可以继续 `newstickerpack` 上传新的贴纸集。

[imagemagick]: http://imagemagick.org/
[bot]: https://telegram.me/stickers
[mika]: https://twitter.com/MikaAkagi
[gochiusa]: https://hummingbird.me/manga/gochuumon-wa-usagi-desu-ka
[sticker1]: https://telegram.me/addstickers/Gochiusa
[sticker2]: https://telegram.me/addstickers/Gochiusa2
[da]: http://frantle.deviantart.com/art/Gochiusa-telegram-stickers-set-540414998
