---
date: 2015-08-28 17:17:46
title: Huawei P7-L07 解锁刷机小记
tags: [Android]
category: Misc
---
今天终于拿到了设备的解锁码，华为对于获取解锁码的限制（注册华为帐号，绑定设备两周以上）简直反人类，他们的客服也是我遇到过的最无用的客服，各种手段疯狂联系客服，得到的回应总是不停地背书，从来不谈解决问题。 (╯°Д°）╯︵/(.□ . )

本记录操作环境是在 **Arch Linux** 下，并已安装 `android-tools`，所以 adb 什么的直接敲终端就来了。

手机那边先启用开发人员选项，在 `设置->关于手机` 中，连戳⑨次手机版本那一项，开发人员选项就会显示在设置菜单中，此时再进入 `设置->开发人员选项`，启用 `USB 调试`。

接下来直接用数据线连接手机与电脑，可以先用 adb 查看一下是否已经连上了。正常的话会列出至少一台设备。

```bash
adb devices
```

如果手机端出现连接提示，选择确认即可。接下来将手机重启到 `fastboot` 模式：

```bash
adb reboot-bootloader
```

完成后手机屏幕上会显示一个安卓小人，下面有红字提示 bootloader 的锁定状态。

再次查看一下设备是否连上电脑状态。

```bash
sudo fastboot devices
```

然后按照华为那边的提示，进行解锁操作：

```bash
sudo fastboot oem unlock <设备解锁码>
```

操作成功之后，手机屏幕上应该会显示 `PHONE Unlocked`。接下来刷入 Recovery，[获取自 xda 的 `TWRP 2.8.1`](http://forum.xda-developers.com/ascend-p7/development/recovery-t2811965)

```bash
sudo fastboot flash recovery <从 xda 下载下来的 TWRP 镜像文件目录>
```

完成操作后，重启设备：

```bash
sudo fastboot reboot
```

然后将需要刷的 ROM 存到手机上。[获取自 xda 的 `material one 1.0`](http://forum.xda-developers.com/ascend-p7/development/rom-material-one-1-0-4-4-2-b126-t3054529)，这个 ROM 要求原系统为 B126 的版本，如果像我一样手残升到 `EMUI3` 的话，需要手动降级回来，降级参见[花粉俱乐部的说明](http://club.huawei.com/thread-4826736-1-1.html)。

接下来重启到 Recovery：

```bash
adb reboot recovery
```

在 recovery 中选择 `install`，选择刚刚存到手机上的那个 ROM 文件，开始安装即可，大概需要越 10 分钟。完成之后在 recovery 上选择重启，接下来就能够看到没有华为一家子乱七八糟应用的新环境了 （。＞ω＜）。
