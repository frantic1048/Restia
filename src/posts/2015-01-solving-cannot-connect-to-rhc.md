---
date: 2015-01-03
title: 解决 rhc 无法创建连接
tags: [rhc, openshift]
category: Tech
---

最近 rhc 忽然连接不上了，提示这样的错误：

    A secure connection could not be established to the server (SSL_connect returned=1 errno=0 state=SSLv3 read server hello A: sslv3 alert handshake failure).
    You may disable secure connections to your server with the -k (or --insecure) option
    'https://openshift.redhat.com/broker/rest/api'.

翻到 Redhat 上一个[文章](https://access.redhat.com/solutions/1233863)搞定了，是因为最近的 SSLv3 漏洞的原因禁用了 SSLv3，换一个非 SSLv3 的连接协议就好啦～

打开 `~/.openshift/express.conf` ，在里面添加以下行即可，我这里是已经有这行只是加了注释，我将其修改成了下面的内容。

    ssl_version=tlsv1

再次运行 rhc， 连接成功╮(￣▽￣)╭
