---
date: 2014-12-27
title: 在校园网内获取外网链接状态
tags: [Web, Javascript]
category: Tech
---

由于校园网实在太神奇，在你没有登录的时候访问外网服务器也会返回 200， 然后送你一个跳转到登录页面地址的页面。
为了获取外网链接状态，干脆直接尝试获取一个来自外网的小 js 库（当然如果自己在外网有空间，随便丢一个 js 上去就可以实现）来检查是否联网。如果成功加载了 js 库的话，那在 window 下面肯定就能找到那个 js 库，以此来检查是否连网。

对于浏览器会主动缓存之前请求过的 js 库的问题，用 ？ + 参数让浏览器以为是不一样的文件，每次都会真正地去请求文件。下面这个实现用的是连续三个 performance.now()，这样重复几率就小的可怜了。

关于外网库的选择，这个栗子用的是 upaiyun 上面的库，当然其他地方的也可以。

```javascript
function detectOnlineStatus() {
  var magi = document.createElement('script');
  magi.setAttribute('type', 'application/javascript');
  magi.setAttribute('src','http://cdnjscn.b0.upaiyun.com/libs/hogan.js/3.0.0/hogan.min.js'+'?'+performance.now()+performance.now()+performance.now());
  window.document.body.appendChild(magi);
  var checker = setInterval(function () {
    if ((!!window.Hogan) { clearInterval(checker);window.dispachEvent(new Event("oya-online")); }
    }, 100);
  setTimeout(function () {
    clearInterval(checker);
    magi.remove();
    window.Hogan = false;
  } ,3000);  //3s to determine network status
}
```
