---
date: 2015-03-21
title: Arch Linux 简易打包指南
tags: [Arch, Linux]
category: Tech
---

这两天给 [Kreogist µ](https://kreogist.github.io/Mu/) 打 Arch Linux 包，照着 wiki 跟着搞，同时在肥猫和 Wicast C 及暴君还有 jimmy66 等强力大腿及小伙伴的支持下，几番折腾终于打好了，也算是入了个门。

搞完过来发现也算简单，总体来说其实就是一个 `PKGBUILD` 文件的编写。就着给 µ 打的这个包写个**简单**指南。在写的时候实在太不知道怎么写的地方还可以直接参考一下其他软件包的 PKGBUILD 是怎么写的我才不会说呢。

#编写 PKGBUILD

在最开头，复制一份原型： `/usr/share/pacman/PKGBUILD.proto`（同目录下也有其他特别类型的原型），之后就从这个文件开始编写啦。

先读完文件开头那段注释，然后删掉它～

##Maintainer

最开头一行注释是维护者的信息，按照它提供的格式填写上有效的信息即可。

##pkgname

软件包的名字。只能用 **小写**字母、数字和`@ . _ + -` 这些字符，且不允许用`.`或者`-`作开头。

另外不要和 AUR 甚至是官方仓库里面的软件包重名了(´・ω・｀)

##pkgver

软件包的版本，就是你打包的那个软件的版本。可以使用数字和小数点，以及其它字符。进一步的规则可参考：[VCS package guidelines - ArchWiki]

##pkgrel

软件包发行号，一般设为 1，如果你因为某些原因给**同版本号**的软件进行反复打包，那么每次打包的时候 pkgrel 就应该在原基础上递增一个数字，而在打包新的版本的时候，应该重新设为 1。

##epoch

强行干涉包的新旧关系，拥有更大的 epoch 值的包会被认做更新的包（此时无视版本号），可以用在如版本号风格改变等需要的时候。默认值为 0，取值为正整数。一般不会用到。

##pkgdesc

软件包的描述信息，最好一句话，且不包含软件的名字。

##arch

表示支持的 Arch Linux 的架构，比如 `i686`、`x86_64`，如果包与平台无关的话就填 `any`。

##url

与软件包相关的链接，一般是项目首页什么的。

##license

软件发布协议，如果是常见的 GPL 的话可以对照下面填写：

- (L)GPL - (L)GPLv2 及更新版本。
- (L)GPL2 - 仅 (L)GPL2
- (L)GPL3 - (L)GPL3 及更新版本


##depends

这是非常重要的一项，需要正确填写上软件的依赖。

对于直接发布可执行程序的话，可以通过 ldd 来看程序连接了哪些库文件，结合搜索判断出具体依赖是什么软件包。你可以用谷歌在 https://www.archlinux.org 上搜索具体库的文件名，一般都能够找到对应的软件包。

如果你已经用 makepkg 打出了 .tar.xz 的包，也可以用 [Namcap][Namcap - ArchWiki] 来检查依赖是否存在问题，它会提供一些有用的信息帮助修正依赖。对于他的输出含义可以直接参考 [ArchWiki][Namcap - ArchWiki]。

多测试多测试，确保依赖真的没问题。

##source

构建软件包需要的文件。可以是一个本地文件，也可以是一个远程文件。 makepkg 会在构建包的时候自动下载填写的远程文件，并且会自动解包压缩文件。

##md5sums

对应的 source 里面文件的 md5 校验码。

##package()

在构架包的时候执行的函数。你需要把安装软件对应的操作写在这里。函数会在一个 `fakeroot` 环境下执行，对应的 root 目录就是 `$pkgdir`，比如你有一个可执行文件名为 `$pkgname` 要安装到 `/usr/bin` 下面，对应的命令就可以类似这么写：

```shell
install -m=775 $pkgname "${pkgdir}/usr/bin"
```

`-m` 选项表示目标文件的权限，和 `chmod` 参数同理。

###常用目录

目录 | 用途
----|--
/etc | 系统关键配置文件，如果件有多个，应该创建合适的子目录来存放
/usr/bin | 二进制文件
/usr/lib | 库
/usr/include | 头文件
/usr/lib/{pkg} | 模块，插件等
/usr/share/doc/{pkg} | 应用程序文档
/usr/share/info | GNU Info 系统文件
/usr/share/man | 手册
/usr/share/{pkg} | 程序数据
/var/lib/{pkg} | 应用持久数据
/etc/{pkg} | {pkg}的配置文件
/opt/{pkg} | 大的独立程序，例如 Java 
/usr/share/applications/ | Desktop Entry (.desktop) 文件
/usr/share/icons/ | 图标，存在该目录下对应子目录位置

不该碰的目录：

- /dev
- /home
- /srv
- /media
- /mnt
- /proc
- /root
- /selinux
- /sys
- /tmp
- /var/tmp

#构建/调试包

在 PKGBUILD 所在目录下执行 makepkg 可以构建出对应的软件包，推荐用 `namcap` 检测一下构建出来的包有没有更显著的问题。

然后你可以用 `pacman -U` 命令安装它，看看会不会发生什么奇怪的事情，以及软件是否正常等。

当然还有可能因为 PKGBUILD 没写好，直接就报错不干了，这个时候需要顺着错误信息去修正 PKGBUILD。

#发布到 AUR

在 PKGBUILD 所在目录执行 `makepkg --source`，会生成 `.src.tar.gz` 源码包，这就是需要上传到 AUR 的东西，注意不要把任何二进制文件加入源码包。

在 [AUR][AUR] (Arch User Repository) 注册（登入）帐号。进入 Submit 页面，选择好软件包对应的分类，然后添加源码包上传即可。

即使你是要更新一个包，也只需要直接在 Submit 页面上传，包的信息 AUR 会自己处理。

如果觉得每次上传太麻烦，你可以尝试一下 [aurupload] 来简化发布。

#参考文档/维基

需要更详尽的内容以及更复杂的打包请参考以下。

- [PKGBUILD(5) Manual Page]
- [Creating packages - ArchWiki]
- [Arch packaging standards - ArchWiki]
- [Namcap - ArchWiki]
- [VCS package guidelines - ArchWiki]

[PKGBUILD(5) Manual Page]: https://www.archlinux.org/pacman/PKGBUILD.5.html
[Creating packages - ArchWiki]: https://wiki.archlinux.org/index.php/Creating_packages
[Arch packaging standards - ArchWiki]: https://wiki.archlinux.org/index.php/Arch_Packaging_Standards
[Namcap - ArchWiki]: https://wiki.archlinux.org/index.php/Namcap
[AUR]: https://aur.archlinux.org/
[VCS package guidelines - ArchWiki]: https://wiki.archlinux.org/index.php/VCS_package_guidelines
[aurupload]: https://aur.archlinux.org/packages/aurupload/
