---
date: 2015-08-18 02:56:02
title: 解决 ssh 密码正确却被拒绝连接
tags: [Arch Linux, Linux, ssh]
category: Tech
---

服务器（ **Arch Linux** 系统）好久没滚过了，今天上去飞速滚完之后登出。再次 ssh 登录的时候，密码正确，却不断提示 `Permission Denied`，当时就奇怪了。明明刚刚还能上 （´＿｀）。

在 Super User 上看到了[情形基本一致的问题的解答](http://superuser.com/questions/543626/ssh-permission-denied-on-correct-password-authentication/543969#543969)，遂用 Linode 提供的备胎 `lish` 登上了服务器，查看了 `sshd` 配置，果然是登录用到的几个选项没有打开，推测是更新 openssh 的时候配置文件顺带被刷新了。

按照解答操作 sshd 的配置文件 < `/etc/ssh/sshd_config` >，解注释（设定）了下面这些配置项：

启用密码认证

    PasswordAuthentication yes

启用 root 用户登录

    PermitRootLogin yes

启用 ssh 密钥登录

    PubkeyAuthentication yes
    AuthorizedKeysFile .ssh/authorized_keys

配置文件至此编辑完成。接下来重启一下 sshd 服务：

```bash
#systemctl daemon-reload
#systemctl restart sshd.service
```
再次尝试 ssh 登录，世界和平！
