---
title: Helix 键盘诞生记
date: 2023-01-08T17:02:27+08:00
tags: [键盘, Helix Keyboard]
category: Tech
cover: ../static/photo/2023-01-helix-keyboard/_DSC4209_01.jpg
---

![Chino with Helix keyboard](../static/photo/2023-01-helix-keyboard/_DSC4209_01.jpg)

这个键盘原本是作为灾备组起来的，吃灰了一阵时间的。我原本有两个在用的 2018 年组起来的键盘，分别是办公用的 [ErgoDone](https://twitter.com/frantic1048/status/955845123127967745) 和移动用的 [Atreus60](https://twitter.com/frantic1048/status/993529840673304577)，结果这两天突然因为 Atreus60 有四颗按键突然不工作了，调查半天也没发现到底哪里有问题，于是 Helix 终于上岗，顺便记录下拖延很久的组装记录 `６Д９`

# 准备

Helix 有多种配置，我这里组装的是五行的，带键盘正面的 OLED 小屏幕和键盘背面的 LED 底灯的组合。按照左右手一对键盘来算，用了以下零件：

| 种类                                  | 数量 | 备注                                                              |
| ------------------------------------- | ---- | ----------------------------------------------------------------- |
| 4pin 排针, 2.54mm 间距, 11.4mm 高     | 2    | OLED 屏用                                                         |
| 4pin 排母, 2.54mm 间距                | 2    | OLED 屏用, 买不到足够矮的, 实际没装这个, 键盘还是能用             |
| OLED 显示屏, 0.91" 4 针 IIC 接口      | 2    | OLED 屏用                                                         |
| LED 灯带, WS2812B (6 灯) 3535, 4mm 宽 | 2    | LED 底灯用,最好带背胶；我用 4mm 发现宽度略窄, 5mm 应该更合适一些  |
| Micro USB 线                          | 1    |                                                                   |
| TRRS/TRS 线                           | 1    |                                                                   |
| TRRS 插座, PJ320-A                    | 2    |                                                                   |
| 贴片二极管, 1N4148WS SOD-123          | 64   |                                                                   |
| 插脚电阻, 4.7 kohm                    | 4    | Helix 文档未列出，经[小伙伴](https://github.com/helloqiu)提醒补充 |
| 轻触开关, 3x6x4.3mm                   | 2    |                                                                   |
| 橡胶脚垫                              | 12   | 数量形状都比较随意                                                |
| 扁头螺丝, M2 5mm                      | 4    |                                                                   |
| 螺丝, M2 3mm                          | 28   |                                                                   |
| 铜柱, M2 8mm                          | 4    |                                                                   |
| 铜柱, M2 4mm                          | 12   | 矮轴专用                                                          |
| 排针, 12 pin                          | 4    | Pro Micro 自带了                                                  |
| Arduino Pro Micro                     | 2    |                                                                   |
| 轴体, 凯华 1350 Low Proflie Red       | 64   | 不好用                                                            |
| 键帽, 1U 凯华 Low Profile             | 64   | 不好用，插上去就别想拔下来了                                      |
| 底板, OLED 屏上盖，亚克力 2mm 厚      | 2    | 提供[图纸][helix-beta-acril-5row] 给亚克力厂家订制                |
| 定位版, 亚克力 3mm 厚                 | 2    | 提供[图纸][helix-beta-acril-5row] 给亚克力厂家订制                |
| Helix PCB                             | 2    | 提供[图纸][helix-pcb]给 PCB 厂家订制                              |

组装会用上的耗材：

| 种类     | 备注                          |
| -------- | ----------------------------- |
| 焊锡     |                               |
| 焊接锡浆 | 我选择的 183°C 熔点的中温锡浆 |

工具：

| 种类   | 备注                         |
| ------ | ---------------------------- |
| 电烙铁 | 配合尖头的烙铁头感觉比较好用 |
| 热风枪 | 配合锡浆，处理贴片元件       |
| 镊子   | 安置贴片元件                 |
| 斜口钳 | 用来剪多余的引脚             |
| 电脑   | 键盘组装好之后，刷固件用     |

零件不完整照片（图中左侧轴体并没有用上）：

![Helix keyboard parts](../static/photo/2023-01-helix-keyboard/_DSC4154.jpg)

# 组装

左右手用的是同样的 PCB，左右正面朝上的时候，两边看起来应该是垂直对称的，后面的图基本都是左手的 PCB 示例。

## 贴片二极管

先装贴片二极管，装的位置是 **PCB 背面**，朝向应当和 PCB 上印刷的标记一致，所有的二极管朝向应该是一致的（个别位置没有标方向），用镊子放上合适的位置，两头挤一点点锡浆上去，不用担心位置有一定的歪斜，用热风枪吹一下之后位置就自动正了。

![](../static/photo/2023-01-helix-keyboard/_DSC4161.jpg)

![](../static/photo/2023-01-helix-keyboard/_DSC4157.jpg)

## 轻触开关、TRRS 插座、和 OLED 屏幕用的跳线

在**PCB 正面**安装 TRRS 插座和轻触开关。以及连接稍微靠上一点的几个跳线（带有 `SDA` `SCL` `VCC` `GND` 字样的那些成对触点）。

![](../static/photo/2023-01-helix-keyboard/_DSC4164.jpg)

## Pro Micro 、OLED 屏、4.7 kohm 电阻

如图所示的方向，把 12 pin 排针与 Pro Micro 焊接到一起：
![](../static/photo/2023-01-helix-keyboard/_DSC4167.jpg)

然后翻一面，没有元件的这一面朝上，尽可能修剪这些突出来的针脚，整个插到**PCB 正面**：
![](../static/photo/2023-01-helix-keyboard/_DSC4168.jpg)

对于 OLED 屏，先和 4 pin 排针焊接上，然后按照图里的样子装到 Pro Micro 上方（这里应该 PCB 上先装个排母的，我没有找到 [Helix 组装指南里高度那么低的排母](https://github.com/MakotoKurauchi/helix/blob/master/Doc/buildguide_en.md#oled-module-optional)，结果就直接插上去了，能用……）：
![](../static/photo/2023-01-helix-keyboard/_DSC4169.jpg)

剪掉突出的针脚，顺便焊上 TRRS 插座旁边的两个电阻：
![](../static/photo/2023-01-helix-keyboard/_DSC4170.jpg)

## LED 灯带

在**PCB 背面**装上 LED 灯带，灯带的触点应该和 PCB 的字样吻合，我的 4mm 灯带有点窄，不是很对的上触点，费了点功夫还是接上了，能用：

![](../static/photo/2023-01-helix-keyboard/_DSC4171.jpg)

![](../static/photo/2023-01-helix-keyboard/_DSC4172.jpg)

## 定位板、轴体

把定位版叠放到 **PCB 正面**，然后把轴体安放上去（推荐从对角位置开始），并且在 **PCB 背面**焊接轴体的引脚：

![](../static/photo/2023-01-helix-keyboard/_DSC4178.jpg)
![](../static/photo/2023-01-helix-keyboard/_DSC4181.jpg)
![](../static/photo/2023-01-helix-keyboard/_DSC4179.jpg)

按照[官方指南的推荐](https://github.com/MakotoKurauchi/helix/blob/master/Doc/buildguide_en.md#switches)，到这一步已经可以给键盘刷个固件，测试一下键盘了。

## 外壳

在 **PCB 正面**，轻触开关旁边装上 8mm 铜柱，背面用 M2 5mm 扁头螺丝固定：

![](../static/photo/2023-01-helix-keyboard/_DSC4189.jpg)
![](../static/photo/2023-01-helix-keyboard/_DSC4190.jpg)

把 4mm 铜柱从**PCB 背面**插上去，上面再盖上背板，两头都用 M2 3mm 螺丝固定，脚垫可以顺便粘上去。

![](../static/photo/2023-01-helix-keyboard/_DSC4192.jpg)
![](../static/photo/2023-01-helix-keyboard/_DSC4196.jpg)
![](../static/photo/2023-01-helix-keyboard/_DSC4193.jpg)

用扁头螺丝固定 OLED 屏的盖板：
![](../static/photo/2023-01-helix-keyboard/_DSC4194.jpg)

最后键帽安上去就算组装完工了，凯华这个矮轴键帽需要超级大力才能装上去。

![Chino with Helix keyboard](../static/photo/2023-01-helix-keyboard/_DSC4209_01.jpg)

# 固件

Helix 可以使用 [QMK 键盘固件](https://qmk.fm/)。

## 准备

在 Arch Linux 上，可以直接装[官方源提供的 QMK CLI](https://archlinux.org/packages/community/any/qmk/)：

```sh
pacman -S qmk
```

初始化 QMK CLI，，执行完命令，它会将 QMK 固件仓库下载到本地：

```sh
qmk setup
```

## 调整与刷写

对于键盘的配置，参考 https://github.com/qmk/qmk_firmware/tree/master/keyboards/helix/rev2 。

可以先刷一个默认布局来测试，[文档能看到](https://github.com/qmk/qmk_firmware/blob/master/keyboards/helix/rev2/keymaps/default/readme.md#customize) 的带 OLED 和底灯的配置名字是 `helix/rev2/under` ，将键盘连上电脑，戳一下键盘上的轻触开关，执行对应的 qmk 命令：

```
qmk compile -kb helix/rev2/under -km default
qmk flash -kb helix/rev2/under -km default
```

然后就可以试试键盘了。

# 参考

-   Helix 键盘源码：https://github.com/MakotoKurauchi/helix
-   Helix 组装指南：https://github.com/MakotoKurauchi/helix/blob/master/Doc/buildguide_en.md
-   Helix 亚克力外壳图纸：https://github.com/MakotoKurauchi/helix/blob/master/Case/helix-beta-acril-5row.pdf

[helix-beta-acril-5row]: https://github.com/MakotoKurauchi/helix/blob/master/Case/helix-beta-acril-5row.pdf
[helix-pcb]: https://github.com/MakotoKurauchi/helix/tree/master/PCB/beta
