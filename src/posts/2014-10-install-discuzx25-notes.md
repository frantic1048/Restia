---
date: 2014-10-11
title: DiscuzX2.5安装小记
tags: [Web]
category: Tech
---

因为不好找下载集成服务器工具，而且他们自己又打包了一份 php 之类的程序，本身系统就已经有 php 还有数据库什么的了再搞一份受不了，最后选择了手动配置……

这是一个在 `Archlinux` 上手动从服务器程序开始部署 DiscuzX2.5 的全过程。

有的配置文件比较长，编辑的时候善用搜索 = =。

#环境准备

- 系统：Linux 3.16.4-1-ARCH
- 服务器与相关软件:
  - nginx 1.6.2-1
  - php 5.6.1-1
  - php-fpm 5.6.1-1
  - mariadb 10.0.14-2
  - discuz x2.5

Discuz 是在这里获取的：[http://www.discuz.net/thread-2744369-1-1.html]()，我选择的是 `X2.5 UTF8 简体中文版`。

其它软件直接全部 `pacman -S nginx php php-fpm mariadb` 安装即可。

#配置 Nginx

配置文件：`/etc/nginx/nginx.conf`

    http {
        include       mime.types;
        default_type  application/octet-stream;

        #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
        #                  '$status $body_bytes_sent "$http_referer" '
        #                  '"$http_user_agent" "$http_x_forwarded_for"';

        #access_log  logs/access.log  main;

        sendfile        on;
        #tcp_nopush     on;

        #keepalive_timeout  0;
        keepalive_timeout  65;

        #gzip  on;

        server {
            listen       80;
            server_name  localhost;

            #charset koi8-r;

            #access_log  logs/host.access.log  main;

            root /usr/share/nginx/html;
            location / {
                index  index.html index.htm index.php;
                #add_header Cache-Control privete;
            }

            location ~ \.php$ {
                fastcgi_pass unix:/run/php-fpm/php-fpm.sock;
                fastcgi_index index.php;
                include fastcgi.conf;
            }

#配置 PHP

配置文件： `/etc/php/php.ini`

`open_basedir` 中加上 `nginx` 服务器的根目录（ `/usr/share/nginx/html/` ）。即告诉 php 程序要去解析那个目录下的 php 文件。

    open_basedir = /usr/share/nginx/html/:/srv/http/:/home/:/tmp/:/usr/share/pear/:/usr/share/webapps/

启用以下扩展。去掉那行开头的分号即可。

    extension=curl.so
    extension=gd.so
    extension=gettext.so
    extension=mysql.so
    extension=mysqli.so
    extension=pdo_mysql.so

#配置 php-fpm

配置文件：`/etc/php/php-fpm.conf`

让 `listen` 的值与之前 nginx 配置中的 `fastcgi_pass` 值保持一致。

    listen = /run/php-fpm/php-fpm.sock

#配置数据库

设置数据库 root 密码

    mysql_secure_installation

#启动服务器

注意这些命令都需要 root 权限。

让服务器开机运行。

    systemctl enable nginx.service
    systemctl enable mysqld.service
    systemctl enable php-fpm.service

启动服务器

    systemctl start nginx.service
    systemctl start mysqld.service
    systemctl start php-fpm.service

#安装 Discuz

将下载下来的 Discuz 程序包解压，将其中的 `upload` 文件夹复制到 `nginx` 服务器的目录下（ `/usr/share/nginx/html/` ）。

打开浏览器，打开[ http://localhost/upload/install/ ]()。

如果世界和平，你的配置一切正常的话，你应该会看到 Dizcuz 的使用协议页面，点击同意之后进入安装向导，向导会自动检测环境，如果你遇到了有 `目录文件` 没有权限或者找不到目录的话，使用 `chmod` 设置一下`nginx` 目录的文件权限。

    chmod -R a+rwx /usr/share/nginx/html/

接下来一步创建数据库。大部分设置顾名思义即可。

    数据库用户名:root
    数据库密码:之前配置数据库的时候创建的root密码

下一步进行安装，世界和平。

之后会询问你是否开通 Discuz 云平台，直接点右边小字暂不开通。之后自动进入论坛。

接下来就随便你玩了。
