---
date: 2014-01-13
title: 修复Arch Linux的引导
tags: [Linux,引导,混合硬盘]
category: Tech
---


今天折腾着给移动硬盘装系统，结果进了几下PE把自己本本的引导玩坏了，搞了半天回忆了一下安装系统的过程，终于把系统给重新正常启动了，万分激动啊！

---

我的本本只有一个ArchLinux在上面，硬盘属于*混合硬盘*，Linux下面会被识别成一个500GB的`/sda`和20GB的`/sdb`,前面一个盘有`/home`,`/var`两个目录，和`swap`分区；根目录被我直接放在固态硬盘的`/sdb`了。

现在问题是引导挂掉了，也就是说GRUB都不能启动了，开机直接黑 `>_<`

#解决步骤

- 用写过ArchLinux镜像的U盘启动，进入64位的Live系统（我的系统是64位的）
- 挂载本本上的分区，*一定要先挂载根目录*

        mount /dev/sdb1 /mnt
        mount /dev/sda3 /mnt/home
        mount /dev/sda2 /mnt/var

- 把根目录切换到本本上的根目录

        arch-chroot /mnt

- 接下来就是grub的操作了，直接安装grub即可。*一定要安装到/sda，也就是硬盘前面的那个分区*，安装到/sdb里面的引导程序不会被BIOS识别出来，*混合硬盘在BIOS里面只被识别为一个硬盘*，并不是像在系统里面看到一样是两个，尽管实际上是两个，个人猜想应该是因为硬盘与主板连接的时候只占了一个插槽的原因吧。

        grub-install --target=i386-pc --recheck /dev/sda
        grub-mkconfig -o /boot/grub/grub.cfg

- 至此，引导程序修复完成，回到正常根目录，卸载所有分区，重启就好咯～

        exit
        umount -R /mnt
        reboot

#心得

混合硬盘的MBR应该安装在BIOS认识的分区上面。
