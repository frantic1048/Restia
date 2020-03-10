---
title: 定制 GH60 (ORG60) 键盘
date: 2017-10-05
tags: [键盘，Colemak，GH60]
category: Tech
---

近来每天上班背着金属壳的 Poker2 来来回回真是难受，这些日子虽说出了新的 Type-C 的支持默认层 Colemak 的 Poker2，但是各种缺货，而且看起来也不能完全为所欲为，最后还是决定假期折腾一波定制力更强的 GH60 了。

最先是看到大鹰写的 [定制GH60机械键盘](https://bigeagle.me/2015/07/gh60/) 发现定制并没有想象中的麻烦，然后网上翻了一通找到个有 Type-C 口的板子的 [卖家](https://shop65989013.taobao.com/)（正好解毒新版 Poker2 的接口），商讨一番支持代组（不包括键帽），然后定了 Poker 配列 + 白色外壳 + 红轴 + 玻纤板（卖家说这个和红轴搭配好于是就试试吧）。

另外难以找到的 Colemak 布局的键帽，遂搞了套蓝色无刻的键帽来个蓝白组合，正好还送了几颗其他颜色的，总体感觉更可爱了 (っ´ω`c)♡

![layout](https://imgur.com/saOIv7G.png)

手感来说，比起之前有钢板红轴的 Poker2 来说软绵绵的，先摸一段时间再说了。

# 定制固件

刚开始问卖家肿么从头构建固件的时候一直被指向 http://tkg.press/ 选 GH60_RevORG_Mod ，用 Chromium 的扩展直接在线刷写，可是一直不好使，而且我想搞一些别的操作：把 Caps 位置那个键做成单点的时候是 Escape，带着 Meta 按的时候是 Esc，这时候网站上的那个预置的 Tricky Esc 也对我没啥用，因此很需要从 0 开始的手动构建，然而到后来也没问到构建的方法……

板子的型号是 ORG60，网上相关信息相对很少，最后在 [QMK Firmware 的源码][qmk_firmware/keyboards/org60 at master]里面找到了这个板子的支持。

于是就可以照着 [QMK 的文档][Install Build Tools - QMK Firmware]开始搞咯～

## 准备

操作的环境是 Arch Linux，除了基本的 `git`，`make` 之类的基本构建工具之外需要这些包：

- aur/dfu-programmer
- dfu-util
- avr-gcc
- avr-libc

然后直接拖 QMK 的源码，因为仓库包含 submodule，所以带上 `--recurse-submodules` 参数来把 submodule 也全都拉下来：

```sh
git clone --recurse-submodules https://github.com/qmk/qmk_firmware
```

然后按照 [QMK 的构建指南][Build/Compile instructions - QMK Firmware]，就可以先随便构建一个已有的 org60 的布局刷进去试试咯（目前不用在意配列是否一样），注意 **刷写操作需要 root 权限** 。这条 make 命令会构建 org60 下的 boardy 布局，然后通过 dfu 进行刷写：

```sh
make org60-boardy-dfu
```

构建之后提示找不到 bootloader 的时候，戳一下板子背面的按钮使其进入刷写模式，然后等几秒中，就可以看到开始刷入了。

接着随便戳一下各种键，看看刚刷入的布局是不是成功生效了。

然后就可以开始编写自己的布局了。

## 编写 `keymap.c`

直接照着 [QMK 的 Keymap overview][Keymap overview - QMK Firmware] 可以写个 keymap 大体的框架出来：

```c
/* 板子对应的头文件 */
#include "org60.h"

/* 各个 Layer 的映射 */
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = KEYMAP( /* xxx */ ),
    [1] = KEYMAP( /* xxx */ ),
    /* 更多的层... */
};

/* 各个 Fn 键的操作 */
const uint16_t PROGMEM fn_actions[] = {
    [0] = ACTION_FUNCTION(0), /* 戳 Fn0 -> 调用 action_function 进行自定义的操作 */
};

void action_function(keyrecord_t *record, uint8_t id, uint8_t opt) {
    /* 这个 id 就是 ACTION_FUNCTION 里的参数 */
    switch (id) {
        case 0:
            /* 戳 Fn0 的操作就在这里处理了 */
            /* ... */
        break;
    }
}
```

然后在 org60 下创建个新的目录来放自己的 `keymap.c`，比如 `/keyboards/org60/keymaps/frantic1048/` 。至此这里面的 `KEYMAP` 的参数还不知道放多少个，很简单，把隔壁的一个 keymap 的参数抄过来就对了，比如看 [boardy][org60/boardy/keymap.c] 的排版还可以就它了。

然后问题来了，keymap 上的键和我实际的配列不太一样，比如它的空格右边有五个键位需要定义，但我的配列实际上只有四个键，不过板子都是一样的，所以把那五个键挨个设置成 `KC_1, KC_2, ... , KC_5}`，然后刷到键盘上，挨着按一下键盘空格右边四个键看看触发了哪几个就能确认哪个是多余的了 （´＿｀）

对于 Caps 那个键的行为，也可以照着 QMK 文档的 [Custom Functions][Custom Functions - QMK Firmware] 那节搞定。

# 我的 Keymap

最后实现的我的布局的代码在 [这里](https://github.com/frantic1048/qmk_firmware/tree/master/keyboards/org60/keymaps/frantic1048)，主要是 Colemak。

## Layer0

http://www.keyboard-layout-editor.com/#/gists/99bdabea615b1181656a02f34a2db61a

![layer 0](https://imgur.com/qSJ6gXt.png)

## Layer1

http://www.keyboard-layout-editor.com/#/gists/11e758a3704a06639e3e10cbf57e7777

![layer 1](https://imgur.com/DvXvrGP.png)

## Layer2

http://www.keyboard-layout-editor.com/#/gists/0ca41635d5cea056c770540733013aa8

![layer 2](https://imgur.com/uNa9XNM.png)

## Layer3

http://www.keyboard-layout-editor.com/#/gists/88f938ed5626072761284364e5bae4de

![layer 3](https://imgur.com/Fg6qHVF.png)

明明有了一个新的键盘可以不用再天天带着键盘来回跑了，可是回头用 Poker2 又觉得布局非常难受了，为什么会这样呢（

# 参考

- [qmk_firmware/keyboards/org60 at master][]
- [Install Build Tools - QMK Firmware][]
- [Build/Compile instructions - QMK Firmware][]
- [Keymap overview - QMK Firmware][]
- [org60/boardy/keymap.c][]
- [Custom Functions - QMK Firmware][]

[qmk_firmware/keyboards/org60 at master]: https://github.com/qmk/qmk_firmware/tree/master/keyboards/org60
[Install Build Tools - QMK Firmware]: https://docs.qmk.fm/getting_started_build_tools.html
[Build/Compile instructions - QMK Firmware]: https://docs.qmk.fm/getting_started_make_guide.html
[Keymap overview - QMK Firmware]: https://docs.qmk.fm/keymap.html
[org60/boardy/keymap.c]: https://github.com/frantic1048/qmk_firmware/blob/master/keyboards/org60/keymaps/boardy/keymap.c
[Custom Functions - QMK Firmware]: https://docs.qmk.fm/keymap.html#custom-functions
