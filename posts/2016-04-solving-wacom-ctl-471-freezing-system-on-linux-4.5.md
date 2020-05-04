---
title: 解决 Linux 4.5 接上 Wacom CTL 471 冻结系统的问题
date: 2016-04-30
tags: [Linux, 内核, Wacom, 数位板]
category: Linux
---

在 Linux 4.3.3 升级 4.4 的时候就遇到这个问题了，系统只要碰着 Wacom CTL 471 板子就立马冻住，或者是提笔就冻，这时候只能强制按电源重启。

当时太懒就一时把内核滚回了 4.3.3 好长时间，最近滚上 4.5 了想着问题大概没有了，然而还是太天真，开机就给我冻住……于是终于不能忍了，得搞定一下才行。顺带记下打内核补丁的姿势。

-   发行版： Arch Linux
-   **出现问题对应的 linux 版本**：linux-4.5.1-1-x86_64
-   **Wacom 驱动版本**：xf86-input-wacom-0.32.0-1-x86_64
-   **Wacom 数位板型号**：Wacom CTL-471

先顺着 [Wacom Tablet - Arch Wiki](https://wiki.archlinux.org/index.php/Wacom_Tablet#System_freeze) 上关于 System Freeze 的解决方案，说是打个内核补丁就好，于是我找到了对应的内核补丁：[[PATCH v2] hid: usbhid: hid-core: fix recursive deadlock](https://lkml.org/lkml/2015/11/20/690)，然后到后面我准备好源码的时候却发现 4.5 内核已经有这个 patch 了，也就是解决问题这个 patch 还不够。

一路搜索找到 [#311 Kernel panic, system freeze since kernel4.4 til 4.5rc6
](https://sourceforge.net/p/linuxwacom/bugs/311/?page=0)，问题描述和我的问题非常一致，仔细读下去后闻到了到问题解决的味道，顺着回复跳到了 [Bug 1317116 - System freeze when Wacom One Tablet (CTL-471) is attached](https://bugzilla.redhat.com/show_bug.cgi?id=1317116)，读下去看来那个 **[PATCH] HID: wacom: fix Bamboo ONE oops** 就是解决问题的 patch 了，于是一把复制下来：

```diff fix-Bamboo-ONE-oops.patch
--- a/drivers/hid/wacom_wac.c
+++ b/drivers/hid/wacom_wac.c
@@ -2426,6 +2426,17 @@ void wacom_setup_device_quirks(struct wacom *wacom)
 	}

 	/*
+	 * Hack for the Bamboo One:
+	 * the device presents a PAD/Touch interface as most Bamboos and even
+	 * sends ghosts PAD data on it. However, later, we must disable this
+	 * ghost interface, and we can not detect it unless we set it here
+	 * to WACOM_DEVICETYPE_PAD or WACOM_DEVICETYPE_TOUCH.
+	 */
+	if (features->type == BAMBOO_PEN &&
+	    features->pktlen == WACOM_PKGLEN_BBTOUCH3)
+		features->device_type |= WACOM_DEVICETYPE_PAD;
+
+	/*
 	 * Raw Wacom-mode pen and touch events both come from interface
 	 * 0, whose HID descriptor has an application usage of 0xFF0D
 	 * (i.e., WACOM_VENDORDEFINED_PEN). We route pen packets back
--
```

接着装个 `abs`，它说用来获取 ABS tree 的脚本，ABS tree 是一个树状的包含了 Arch 所有软件包源文件的目录（总之还是看 [Arch Build System - Arch Wiki](https://wiki.archlinux.org/index.php/Arch_Build_System#ABS_overview) 吧），用它来获取构建 linux 包所需的源文件（像 PKGBUILD 之类的），然后从 abs 同步下来的 /var/abs/ 里面取出 linux 包的目录，复制到准备对 Linux 进行 ~~魔改~~ 打补丁的目录：

```bash
sudo pacman -S abs
sudo abs
sudo abs linux
cp -r /var/abs/core/linux ~/arch_packages/
```

为了确认一下 patch 是没被打上的想先看看源码，先不急着开始构建，把所有源代码先准备好：

```bash
makepkg -o # 这个选项下 makepkg 只会下载校验解压好所有源代码/资源文件
```

结果遇到了 gpg 验证过不去，顺着错误原因搜了一下，将这俩人（**Linus Torvalds**， **Greg Kroah-Hartman**）的 gpg 公钥加入自己的 gpg 配置里面就好了，比较懒的话可以直接用带 GUI 的 Kleopatra 完成这一步，在其 `Directory Services` 的设置里面加入 http://pgp.mit.edu 这个服务器（确保能搜到那俩 key），然后在主界面戳 `Lookup Certificates on Server`，搜索 key 的后八位（Key ID），比如 00411886，就能够找到对应的证书啦，一键 import 之。

```
==> Verifying source file signatures with gpg...
    linux-4.5.tar ... FAILED (unknown public key 79BE3E4300411886)
    patch-4.5.1 ... FAILED (unknown public key 38DBBDC86092693E)
```

然后翻开看了一下 `/drivers/hid/wacom_wac.c` 对应的 2426 行附近，嗯，patch 没被打上的。把从 bugzilla 那边扒下来的 `fix-Bamboo-ONE-oops.patch` 放到和 PKGBUILD 相同目录下，然后在 PKGBUILD 里面添加上这个文件和对应的 shasum，并在 `prepare()` 里面 patch 它，由于个人口味顺带自定义了一下内核名字（修改 pkgbase 的值）。PKGBUILD 的开头看起来像这样（这不是完整的 PKGBUILD！，需要完整的源文件请跳到文末）：

```bash PKGBUILD
# $Id: PKGBUILD 265148 2016-04-19 06:55:26Z tpowa $
# Maintainer: Tobias Powalowski <tpowa@archlinux.org>
# Maintainer: Thomas Baechler <thomas@archlinux.org>

#pkgbase=linux               # Build stock -ARCH kernel
pkgbase=linux-Kafuu       # Build kernel with a different name
_srcname=linux-4.5
pkgver=4.5.1
pkgrel=1
arch=('i686' 'x86_64')
url="http://www.kernel.org/"
license=('GPL2')
makedepends=('xmlto' 'docbook-xsl' 'kmod' 'inetutils' 'bc')
options=('!strip')
source=("https://www.kernel.org/pub/linux/kernel/v4.x/${_srcname}.tar.xz"
        "https://www.kernel.org/pub/linux/kernel/v4.x/${_srcname}.tar.sign"
        "https://www.kernel.org/pub/linux/kernel/v4.x/patch-${pkgver}.xz"
        "https://www.kernel.org/pub/linux/kernel/v4.x/patch-${pkgver}.sign"
        # the main kernel config files
        'config' 'config.x86_64'
        # standard config files for mkinitcpio ramdisk
        'linux.preset'
        'change-default-console-loglevel.patch'
        'fix-Bamboo-ONE-oops.patch')

sha256sums=('a40defb401e01b37d6b8c8ad5c1bbab665be6ac6310cdeed59950c96b31a519c'
            'SKIP'
            '060ad091ebfa2b63d62e86beaf68c3a5d4638c506c3ac941c1825ba756e830b1'
            'SKIP'
            '8a8a955f015ee8342701231a63836cec0e300fd7e96d30e8696fde8a383fcdc9'
            '8b60911aad591306336e300e27071f2d108c5016e66a04327b82ac69acbfefff'
            'f0d90e756f14533ee67afda280500511a62465b4f76adcc5effa95a40045179c'
            '1256b241cd477b265a3c2d64bdc19ffe3c9bbcee82ea3994c590c2c76e767d99'
            '7dec753db812bd8a268e50d97cb1704b4ed097746e423720f6872ecf4a14e78c')
validpgpkeys=(
              'ABAF11C65A2970B130ABE3C479BE3E4300411886' # Linus Torvalds
              '647F28654894E3BD457199BE38DBBDC86092693E' # Greg Kroah-Hartman
             )

_kernelname=${pkgbase#linux}

prepare() {
  cd "${srcdir}/${_srcname}"

  # add upstream patch
  patch -p1 -i "${srcdir}/patch-${pkgver}"

  # add latest fixes from stable queue, if needed
  # http://git.kernel.org/?p=linux/kernel/git/stable/stable-queue.git

  # set DEFAULT_CONSOLE_LOGLEVEL to 4 (same value as the 'quiet' kernel param)
  # remove this when a Kconfig knob is made available by upstream
  # (relevant patch sent upstream: https://lkml.org/lkml/2011/7/26/227)
  patch -p1 -i "${srcdir}/change-default-console-loglevel.patch"

  # Fix System freeze with Wacom Bamboo One Tablet
  # Relevant patch: https://bugzilla.redhat.com/show_bug.cgi?id=1317116#c11
  patch -p1 -i "${srcdir}/fix-Bamboo-ONE-oops.patch"

  if [ "${CARCH}" = "x86_64" ]; then
    cat "${srcdir}/config.x86_64" > ./.config
  else
    cat "${srcdir}/config" > ./.config
  fi

  if [ "${_kernelname}" != "" ]; then
    sed -i "s|CONFIG_LOCALVERSION=.*|CONFIG_LOCALVERSION=\"${_kernelname}\"|g" ./.config
    sed -i "s|CONFIG_LOCALVERSION_AUTO=.*|CONFIG_LOCALVERSION_AUTO=n|" ./.config
  fi

  # set extraversion to pkgrel
  sed -ri "s|^(EXTRAVERSION =).*|\1 -${pkgrel}|" Makefile

  # don't run depmod on 'make install'. We'll do this ourselves in packaging
  sed -i '2iexit 0' scripts/depmod.sh

  # get kernel version
  make prepare

  # load configuration
  # Configure the kernel. Replace the line below with one of your choice.
  #make menuconfig # CLI menu for configuration
  #make nconfig # new CLI menu for configuration
  #make xconfig # X-based configuration
  #make oldconfig # using old config from previous kernel version
  # ... or manually edit .config

  # rewrite configuration
  yes "" | make config >/dev/null
}
```

接下来就可以开始构建内核了，为了更快一点，可以开个 -j8 什么的：

```bash
MAKEFLAGS="-j8" makepkg
```

我可怜的小本本（CPU i5 3337U）跑了有四个小时才跑完，如果你的处理器不是很厉害的话，最好确保一下电源的稳定确保跑过这场马拉松。

跑完之后会构建出三个包，根据设置的 pkgbase 不同，包名也会有所不同，一把安装之即可：

```
sudo pacman -U linux-Kafuu-4.5.1-1-x86_64.pkg.tar.xz linux-Kafuu-docs-4.5.1-1-x86_64.pkg.tar.xz linux-Kafuu-headers-4.5.1-1-x86_64.pkg.tar.xz
```

接着别急着重启，先刷新一下引导，在启动项中添加新内核的入口，grub 会自动搞定这件事情：

```
sudo grub-mkconfig
```

然后戳开 `/boot/grub/grub.cfg` 瞅瞅刚添加的内核是不是在启动菜单的第一个选项（看下第一个 menuentry 下是不是有 linux-Kafuu 即可），这样开机的时候直接回车进第一个就是刚刚新鲜的内核了，如果不是的话，那么应该可以在下面的 submenu 里面找到～

最后重启电脑，启动新的内核，接上 Wacom CTL 471 的数据线，世界和平！系统没有再被冻结啦，撒花！

![screenshot](https://67.media.tumblr.com/49e978dc178d393eb826a4e3704ad37a/tumblr_o6esal7SNi1tas1ppo1_1280.png)

关于打了 patch 的 linux 包源文件戳 [gist 链接](https://gist.github.com/frantic1048/20219d69ad17b70cc7efd9d24532bd89)，你可以下下来 `makepkg` 直接构建出文中所述没有问题的内核。

另一消息是那个 patch 会并入 linux 4.6，我检查了一下 Arch Linux 中文社区源的 [linux-mainline](https://github.com/archlinuxcn/repo/tree/master/linux-mainline) （当前版本是 4.6-rc5）之后发现果然那个 patch 已经打进去了。如果不想自己编译内核的话，可以尝试一下这个包。
