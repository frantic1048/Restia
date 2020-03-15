---
date: 2014-01-13
title: 修复Arch Linux的引导
tags: [Linux, 引导, 混合硬盘]
category: Tech
---

今天折腾着给移动硬盘装系统，结果进了几下 PE 把自己本本的引导玩坏了，搞了半天回忆了一下安装系统的过程，终于把系统给重新正常启动了，万分激动啊！

---

我的本本只有一个 ArchLinux 在上面，硬盘属于*混合硬盘*，Linux 下面会被识别成一个 500GB 的`/sda`和 20GB 的`/sdb`,前面一个盘有`/home`,`/var`两个目录，和`swap`分区；根目录被我直接放在固态硬盘的`/sdb`了。

现在问题是引导挂掉了，也就是说 GRUB 都不能启动了，开机直接黑 `>_<`

#解决步骤

-   用写过 ArchLinux 镜像的 U 盘启动，进入 64 位的 Live 系统（我的系统是 64 位的）
-   挂载本本上的分区，_一定要先挂载根目录_

          mount /dev/sdb1 /mnt
          mount /dev/sda3 /mnt/home
          mount /dev/sda2 /mnt/var

-   把根目录切换到本本上的根目录

          arch-chroot /mnt

-   接下来就是 grub 的操作了，直接安装 grub 即可。_一定要安装到/sda，也就是硬盘前面的那个分区_，安装到/sdb 里面的引导程序不会被 BIOS 识别出来，_混合硬盘在 BIOS 里面只被识别为一个硬盘_，并不是像在系统里面看到一样是两个，尽管实际上是两个，个人猜想应该是因为硬盘与主板连接的时候只占了一个插槽的原因吧。

          grub-install --target=i386-pc --recheck /dev/sda
          grub-mkconfig -o /boot/grub/grub.cfg

-   至此，引导程序修复完成，回到正常根目录，卸载所有分区，重启就好咯～

          exit
          umount -R /mnt
          reboot

#心得

混合硬盘的 MBR 应该安装在 BIOS 认识的分区上面。
