---
title: 给 Arch Linux 换个文件系统和启用全盘加密
date: 2016-11-02
tags: [Arch Linux,dm-crypt,btrfs]
category: Linux
---

近来组装好了一个新的小电脑，于是终于可以放心对之前的小本本做各种想做不敢做的大改动了。于是我就：

- 分区表和引导方式从 MBR/Legacy 换到了 GPT/UEFI。
- 文件系统从 ext4 换到了跨设备的 btrfs。
- 启用了 btrfs on LUKS 的全盘加密。

当然，所有个过程里面是不包括装新系统的，前后的系统还是一模一样的系统～

总体流程如下：

- 备份系统
- 创建新分区表和文件系统
- 还原系统
- 配置启动与引导程序

最后的本本两块硬盘的存储结构是这样：

```plain
+---------------------------------------------------------------------+
|EFI System|Root                                  |Swap               |
|/boot/efi |/                                     |Swap               |
|FAT32     |Btrfs                                 |Swap!!!            |
|          +-------------------+------------------+-------------------+
|          |LUKS container     |LUKS container    |LUKS container     |
|          |/dev/mapper/cryroot|/dev/mapper/cryext|/dev/mapper/cryswap|
+----------+-------------------+------------------+-------------------+
|Partition |Partition          |Partition         |Partition          |
|/dev/sdb1 |/dev/sdb2          |/dev/sda1         |/dev/sda2          |
+----------+-------------------+------------------+-------------------+
|20GB SSD                      |500GB HDD                             |
|GPT                           |GPT                                   |
|/dev/sdb                      |/dev/sda                              |
+---------------------------------------------------------------------+
```

由于之前饱受 20GB 根目录（系统装在了那个 20G 的 SSD 上）的限制，随着系统更新，软件体积的缓慢变大，根目录的分区长期不足 1G 剩余空间，所以我使用 btrfs 将两块盘上的空间连起来做根目录了。

注意：在原味的 encrypt HOOK 支持[引导时解密多个 LUKS container][FS#23182 - Multiple device support for encrypt hook] 之前，让系统分区横跨一个以上的 LUKS container 这种事情务必三思，后文有述因此造成的麻烦。

这并不是唯一的**全盘加密**（即包括系统本身也加密）方案，更多的可参考 [dm-crypt/Encrypting an entire system - ArchWiki][]，我采用方案主体与其中介绍的 *Btrfs subvolumes with swap*  相似。

# 备份系统

既然不想重装系统，那肯定就先要备份系统咯，这整个过程其实相当于完成了一次系统的迁移，可以参考[Arch Wiki 上关于迁移系统的介绍][Migrate installation to new hardware - ArchWiki]。

我直接把原来本本的数据备份到了另一台电脑上，在局域网下通过网络来传输数据，确保一条尽量快的传输备份数据数据链路能够在这一步少花很多时间，让速度瓶颈卡在硬盘 IO 上是最好不过的～

先确保 sshd 允许 root 用户登录：`/etc/ssh/sshd_config` 中加入 `PermitRootLogin yes`。因为要备份整个系统需要 root 权限。

然后在待备份的电脑上启动 sshd：`#systemctl start sshd`。

接着在另一台电脑上创建好用来保存备份的数据的目录，用 ssh 直接 dd 硬盘数据到本地，这样好处是不会受制于文件系统在小文件传输的时候奇慢无比的问题，只要另一头有足够的存储空间就行了：

```
ssh root@10.50.136.233 "dd if=/dev/sda" | dd status=progress of=~/onmybackup/sda.img
ssh root@10.50.136.233 "dd if=/dev/sdb" | dd status=progress of=~/onmybackup/sdb.img
```

备份完数据之后，就可以关掉本本，把启动改成 UEFI，然后插个 Arch 的 liveusb 上去，然后继续开着 sshd 待命就可以了，使用 ssh 可以避免在两个机器的输入设备之间来回切换，何况我现在用着 Colemak，本本那个 qwerty 光是开机敲敲 dhcpcd 都已经很抓狂了（

# 创建新分区表和文件系统

现在准备开始[硬盘擦除][dm-crypt/Drive preparation - ArchWiki]，在两块硬盘上开俩随机密钥的 LUKS container

```sh
cryptsetup open --type plain /dev/sda containera --key-file /dev/random
cryptsetup open --type plain /dev/sdb containerb --key-file /dev/random
```

通过 `fdisk -l` 应该可以看到 `/dev/mapper/` 下多了 `containera` 和 `containerb`，现在的存储结构是这样：

```plain
+----------+-------------------+------------------+-------------------+
|LUKS container                |LUKS container                        |
|/dev/mapper/containera        |/dev/mapper/containerb                |
+----------+-------------------+------------------+-------------------+
|20GB SSD                      |500GB HDD                             |
|GPT                           |GPT                                   |
|/dev/sdb                      |/dev/sda                              |
+---------------------------------------------------------------------+
```

接下来直接向刚创建的两个 LUKS container 用 0 填充，就能够完成擦除硬盘了，因为 LUKS 容器的密钥是 `/dev/random` ，所以对其写 0 的时候实际到硬盘上是随机的数据。

```bash
dd if=/dev/zero of=/dev/mapper/containera status=progress
dd if=/dev/zero of=/dev/mapper/containerb status=progress
```

完成之后关闭刚刚开启的两个 LUKS container。

```bash
cryptsetup close containera
cryptsetup close containerb
```

接下来就是用 `fdisk` 在 `/dev/sda` 和 `/dev/sdb` 上创建新的分区表和分区了。这样就有了：

```plain
+----------+-------------------+------------------+-------------------+
|Partition |Partition          |Partition         |Partition          |
|/dev/sdb1 |/dev/sdb2          |/dev/sda1         |/dev/sda2          |
+----------+-------------------+------------------+-------------------+
|20GB SSD                      |500GB HDD                             |
|GPT                           |GPT                                   |
|/dev/sdb                      |/dev/sda                              |
+---------------------------------------------------------------------+
```

除了 `/dev/sdb1` 是给 EFI 用之外，剩下的分区全都是要加密的，这次给要加密的分区创建 LUKS 头和密钥：

```bash
cryptsetup luksFormat /dev/sdb2
cryptsetup luksFormat /dev/sda1
cryptsetup luksFormat /dev/sda2
```

更多关于 luksFormat 的选项参见 [dm-crypt/Device encryption - ArchWiki#Encryption options for LUKS mode][]， 我的本本只有俩 USB 口，一个插着网卡，一个插着 U 盘，所以就用默认的手输密码作为密钥了 Q\_Q

接下来“打开”三块加密的分区，期间会被要求输入刚刚设置 LUKS 的密码：

```bash
cryptsetup open --type luks /dev/sdb2 cryroot
cryptsetup open --type luks /dev/sda1 cryext
cryptsetup open --type luks /dev/sda2 cryswap
```

现在存储结构就变成了下面这样，再创建好文件系统就可以开始用啦～

```plain
+----------+-------------------+------------------+-------------------+
|          |LUKS container     |LUKS container    |LUKS container     |
|          |/dev/mapper/cryroot|/dev/mapper/cryext|/dev/mapper/cryswap|
+----------+-------------------+------------------+-------------------+
|Partition |Partition          |Partition         |Partition          |
|/dev/sdb1 |/dev/sdb2          |/dev/sda1         |/dev/sda2          |
+----------+-------------------+------------------+-------------------+
|20GB SSD                      |500GB HDD                             |
|GPT                           |GPT                                   |
|/dev/sdb                      |/dev/sda                              |
+---------------------------------------------------------------------+
```

首先是 EFI 用的分区：`mkfs.fat -F32 /dev/sdb1` 。

然后在 cryroot 和 cryext 上创建一个 btrfs 分区，`-d single` 会让后面的设备的存储空间跟纸带一样连在一起，创建出来的分区容量是简单的相加：

`mkfs.btrfs -d single /dev/mapper/cryroot /dev/mapper/cryext`

swap 就简单啦：`mkswap /dev/sda2`

接下来就是挂载上这些分区了，由于 cryroot 和 cryext 是一个分区，所以随便挂哪个都行。

```
mount /dev/mapper/cryroot /mnt
mkdir /mnt/boot/efi
mount /dev/sdb1 /mnt/boot/efi
```

这样最终需要的存储结构就已经完成，可以开始往里面写数据啦～

# 还原系统


回到刚刚存了备份数据的系统，打开刚备份的硬盘镜像，（需要 root 用户来执行），然后在 Dolphin 上戳一下新出现的一个个分区就挂载上了。

```
losetup -P /dev/loop0 ~/onmybackup/sda.img
losetup -P /dev/loop1 ~/onmybackup/sdb.img
```

接着记得保持用 root 用户，**从根目录开始**，到每一个分区的根目录去，把分区的内容 rsync 回本本系统的对于目录。

可以通过 rsync 的 `--exclude` 排除一些没必要恢复的目录，比如缓存目录什么的，这样可以减少一点传输时间。

```
rsync -SPAaXr PATH_TO_ROOT root@10.50.136.233:/mnt/
rsync -SPAaXr PATH_TO_HOME root@10.50.136.233:/mnt/home/
#...
```

# 配置启动与引导程序

现在系统已经恢复了，在本本上，直接 chroot 到恢复的系统：

`arch-chroot /mnt`

相比与原来的系统，现在的变化就是分区变了，以及启动方式改变了，引导也没了。

由于是系统自己都被加密了，所以需要额外的步骤来让引导程序启动系统。

由于开头提到在系统分区跨多个 LUKS container 未受到 encrypt HOOK 直接支持的问题。这里我使用了 `aur/mkinitcpio-multiencrypt` 提供的 HOOK 来解决这个问题，缺点是，目前只支持手打密码的认证方式 Q_Q 系统分区没有跨越多个 LUKS container 的话，就直接用 encrypt 这个 HOOK 就行了。

在 `/etc/mkinitcpio.conf` 的 HOOKS 行中，加入 `multiencrypt` ，以及为了能用键盘输密码，确保 `keyboard` 在它前面。

在 Grub 的配置 `/etc/default/grub` 中添加 HOOK 对应参数，如果 `GRUB_CMDLINE_LINUX` 已经有别的参数，则用空格与其隔开即可，如下可见参数格式为 `"<device>:<device mapper name>;<device>:<device mapper name>;..."`，因为这个 HOOK 支持多设备，所以我就顺便把全部用到的设备都写上了，这样之后就不用单独创建一个 [crypttab][dm-crypt/System configuration - ArchWiki#crypttab] 来做这个事情了 (っ*'ω'*c)﻿

```plain
GRUB_CMDLINE_LINUX="cryptdevices=/dev/sdb2:cryroot;/dev/sda2:cryext;/dev/sda1:cryswap"
```

配置搞定之后，就可以生成启动镜像和引导配置咯，顺便装上引导程序，mkinitcpio 的内核名字参照自己用的就好：

```bash
mkinitcpio -p linux-zen
grub-mkconfig -o /boot/grub/grub.cfg
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub
```

关于处理分区格局发生变化的最后一件事，就是生成新的 fstab 让系统启动的时候正确挂载分区咯，先退出 chroot 环境，然后：

```
genfstab /mnt >> /mnt/etc/fstab
```

再检查一下生成的 fstab 里面如果有 live 系统的 U 盘的话将其删掉就好了。

最后重启电脑，拔掉 U 盘，原味的系统又回来了，只是现在启动要多输点密码 ( ⚆ \_ ⚆ )

# 参考

- [FS#23182 - Multiple device support for encrypt hook][]
- [dm-crypt/Encrypting an entire system - ArchWiki][]
- [Migrate installation to new hardware - ArchWiki][]
- [dm-crypt/Drive preparation - ArchWiki][]
- [dm-crypt/Device encryption - ArchWiki#Encryption options for LUKS mode][]
- [dm-crypt/System configuration - ArchWiki#crypttab][]

[FS#23182 - Multiple device support for encrypt hook]: https://bugs.archlinux.org/task/23182
[dm-crypt/Encrypting an entire system - ArchWiki]: https://wiki.archlinux.org/index.php/Dm-crypt/Encrypting_an_entire_system
[Migrate installation to new hardware - ArchWiki]: https://wiki.archlinux.org/index.php/Migrate_installation_to_new_hardware
[dm-crypt/Drive preparation - ArchWiki]: https://wiki.archlinux.org/index.php/Dm-crypt/Drive_preparation
[dm-crypt/Device encryption - ArchWiki#Encryption options for LUKS mode]: https://wiki.archlinux.org/index.php/Dm-crypt/Device_encryption#Encryption_options_for_LUKS_mode
[dm-crypt/System configuration - ArchWiki#crypttab]: https://wiki.archlinux.org/index.php/Dm-crypt/System_configuration#crypttab

