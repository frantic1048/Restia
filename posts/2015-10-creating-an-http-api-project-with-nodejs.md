---
date: 2015-10-07
title: 打造一个基于 Node.js 的 Web API 工程
tags: [JavaScript, Node.js, 测试, 集成, 自动化, 数据库]
category: Web
---

最近被强上服务端，记录个创建过程（什么时候有个 IDE 能用(..•˘_˘•..)﻿）。流水帐警报。

此次目的是建立一个只提供 API 的服务器，所以前端什么的就不用管了，直接上 Node.js 搞。关于各项工具的进一步使用，建议顺着下面的链接查阅对应文档，总览如下：

-   服务器：[Express][express]@4.12.3
-   数据库：[MongoDB][mongodb]@3.0.7
-   测试框架：[Jasmine][jasmine]@2.3.2
-   API 测试工具：[hippie][hippie]@0.4.0
-   测试覆盖率报告：[Istanbul][istanbul]@0.3.22
-   工作流：[Gulp][gulp]@3.9.0
-   版本管理：[git][git]@2.6.1（Github）
-   Lint：[eslint][eslint]@1.6.0
-   编译（[ES6][es6] -> ES5）：[Babel][babel]@5.8.25
-   源代码：
    -   程序：JavaScript（ES6）
    -   测试及其它：JavaScript（ES5）
-   在线平台：
    -   [Code Climate][codeclimate]：覆盖率报告，静态分析
    -   [Travis CI][travis-ci]：自动测试、报告

[express]: http://expressjs.com/
[mongodb]: https://www.mongodb.org/
[jasmine]: http://github.com/pivotal/jasmine
[hippie]: https://github.com/vesln/hippie
[istanbul]: https://github.com/gotwarlost/istanbul
[gulp]: http://gulpjs.com/
[git]: http://git-scm.com/
[eslint]: http://eslint.org/
[babel]: http://babeljs.io/
[codeclimate]: https://codeclimate.com
[travis-ci]: https://travis-ci.org/
[es6]: http://exploringjs.com/

最终的项目目录结构看起来是这样子的：

```
.
├── build                  // ES6 代码编译输出目录
├── .codeclimate.yml       // Code Climate 配置
├── config.js              // 程序自己的配置
├── coverage               // Istanbul 生成的测试报告目录
├── .eslintrc              // ESLint 配置
├── .git                   // git 目录
├── gulpfile.js            // Gulp 配置
├── mongodb.conf           // MongoDB 配置
├── node_modules           // NPM 安装的依赖模块目录
├── package.json           // 程序自己的 NPM 包信息
├── data                   // MongoDB 数据库目录
│   └── mongodb
├── src                    // 源代码目录
│   └── app.js
├── test                   // 测试程序目录
│   └── spec
│       └── yahaloSpec.js
└── .travis.yml            // Travis CI 配置
```

# 创建 NPM package

先在 Github 创建新的仓库。

写一个 Node.js 程序的例行，给项目创建 package.json 以管理依赖。按照命令提示填写即可。

```bash
npm init
```

用 gulp 管理程序所有入口，在 pakcage.json 中 `scripts` 字段如下填写。

```json
"scripts": {
    "test": "gulp",
    "dev": "gulp dev",
    "run": "gulp run"
}
```

# 编写 gulpfile.js

## 共用变量

将一些常用目录写在变量中，会比较容易管理。

```javascript
var appSrc = 'src/**/*.js' // 程序源代码
var appDest = 'build/**/*.js' // 编译输出的文件
var appDestPath = 'build' // 编译输出目录
var testSrc = ['test/spec/*Spec.js'] // 测试程序源代码
var server = null // 用来保存 http 服务器实例，在启动服务器测试的时候
```

## Lint

本人是直接用了 [AirBnB 的 JS 规范](https://github.com/airbnb/javascript)去掉了 JSX 部分。选择自己喜欢的 `.eslintrc` 放在根目录就可以啦。

接着是在根目录编写 `gulpfile.js`，先是完成 lint 工作

```javascript
var gulp = require('gulp')
var eslint = require('gulp-eslint')

gulp.task('lint', function () {
    return gulp
        .src(appSrc)
        .pipe(eslint({ rulePaths: ['./'] }))
        .pipe(eslint.format())
})
```

## 编译 ES6 代码

使用 Babel 将 ES6 的源代码编译到 CommonJS 规范的 ES5 代码，输出到 `build` 目录。

```javascript
var babel = require('gulp-babel')
var newer = require('gulp-newer')

gulp.task('compile', function () {
    return gulp
        .src(appSrc)
        .pipe(newer(appDestPath))
        .pipe(babel({ modules: 'common' }))
        .pipe(gulp.dest(appDestPath))
})
```

## 启动/关闭服务器

通过 Gulp 来控制服务器的开关。这里利用前面创建的 server 这个变量储存服务器实例，保证只有一个实例运行。

```javascript
gulp.task('serve', function (callback) {
    server = require('./build/app')
    callback()
})

gulp.task('end-serve', function (callback) {
    if (server) {
        server.close()
        server = null
    }
    callback()
})
```

## 测试

由于测试的是服务端程序，需要测试前先启动服务器，根据 [gulp-stanbul 的说明](https://github.com/SBoudrias/gulp-istanbul)，将任务分成以下两部分。在 `pre-tset` 和 `test` 任务之间启动服务器即可。

```javascript
var jasmine = require('gulp-jasmine')
var SpecReporter = require('jasmine-spec-reporter')
var istanbul = require('gulp-istanbul')

gulp.task('pre-test', function () {
    return gulp.src(appDest).pipe(istanbul()).pipe(istanbul.hookRequire())
})

gulp.task('test', function () {
    return gulp
        .src(testSrc)
        .pipe(jasmine({ reporter: new SpecReporter() }))
        .on('end', function () {
            // 测试跑完关闭服务器
            server.close()
            server = null
        })
        .pipe(istanbul.writeReports())
})
```

## 监视

在开发的时候，让源代码改变的时候自动重新编译运行。而在测试程序改变的时候，重跑一遍测试。这里利用 run-sequence 来让一次而不是并行地执行 gulp 任务，在 Gulp 4.0 （参见 [Migrating to gulp 4 by example - We Are Wizards Blog](https://blog.wearewizards.io/migrating-to-gulp-4-by-example)）中已经自带了 gulp.series 与 gulp.parallel 来控制执行次序。

```javascript
var runSequence = require('run-sequence')
gulp.task('watcher-appSrc', function (callback) {
    runSequence('end-serve', 'compile', 'pre-test', 'serve', 'test', callback)
})

gulp.task('watcher-testSrc', function (callback) {
    runSequence('pre-test', 'test', callback)
})

gulp.task('watch', function (callback) {
    gulp.watch(appSrc, ['watcher-appSrc'])
    gulp.watch(testSrc, ['watcher-testSrc'])
    callback()
})
```

## 串接任务

将前面的任务串起来，分别创建用于 CI 的一次性测试、开发中持续监视与作为后端运行的三个最终使用的任务。

```javascript
// once
gulp.task('default', function (callback) {
    runSequence(['compile', 'lint'], 'pre-test', 'serve', 'test', 'end-serve', callback)
})

// develop
gulp.task('dev', function (callback) {
    runSequence('compile', 'pre-test', 'serve', 'test', 'watch', callback)
})

// run server
gulp.task('run', function (callback) {
    runSequence('compile', 'serve', callback)
})
```

# 安装依赖

根据前面用到的包，以及服务端的需求，安装并保存依赖到 package.json 中去。

```bash
npm install --save express gulp mongodb mongoskin run-sequence
npm install --save-dev babel-eslint gulp-babel gulp-eslint gulp-istanbul gulp-jasmine jasmine-spec-reporter hippie gulp-newer
```

# 配置文件

用一个配置文件来保存程序配置，比如服务器端口号，创建在根目录 `config.js`。

```javascript
var config = {
    serverPort: 2333, // 服务器端口
    databaseURI: 'mongodb://localhost:27017', // MongoDB 数据库 URI
    dev: true, // 开发模式标志
}

module.exports = config
```

# 编写测试

先编写一个最简单的 GET 请求测试，文件为 `test/spec/yahaloSpec.js`，服务器端口就从配置中读取。

```javascript
var hippie = require('hippie')
var port = require('../../config').serverPort

describe('yahalo Spec !', function () {
    it('should get 200 yooo', function (done) {
        hippie()
            .base('http://localhost:' + port)
            .get('/')
            .expectStatus(200)
            .expectBody('yahalo! GET!')
            .end(function (err, res, body) {
                if (err) done.fail(err)
                else done()
            })
    })
})
```

# 创建 MongoDB 配置

先为 MongoDB 创建数据库目录 `data/mongodb`。
在根目录添加 MongoDB 配置 `mongodb.conf`：

```config
# See http://www.mongodb.org/display/DOCS/File+Based+Configuration for format details
# Run mongod --help to see a list of options

port = 27017
bind_ip = 127.0.0.1
httpinterface = true
rest = true
quiet = false
dbpath = data/mongodb
logpath = data/mongod.log
logappend = true
```

# 编写服务端程序

写一个最简单的只会相应 GET 请求的程序（`src/app.js`）,同时在启动的时候连接 MongoDB。

```javascript
import express from 'express'
import mongoose from 'mongoose'
import config from '../config'

const app = express()

mongoose.connect(config.databaseURI, () => {
    if (config.dev) {
        // 在开发模式运行的时候，在一开始清空数据库
        mongoose.connection.db.dropDatabase()
    }
})

app.get('/', (req, res) => {
    res.send('yahalo! GET!')
})

const server = app.listen(config.serverPort, () => {
    console.log(`my app listening at http://localhost:${server.address().port}`)
})

server.on('close', () => {
    // 在关闭服务器的时候断开数据库连接
    mongoose.connection.close()
})

export default server
```

接下来在根目录执行 `mongod -f mongodb.conf` 启动数据库，然后直接运行 `gulp`,就能够看到命令行下输出的测试报告了，以及 istanbul 在 coverage 目录下生成的各种格式的报告（包括 html）。

# 整合 Code Climate 和 Travis CI

首先在两个平台都将项目的 Github 仓库添加上。在 Code Climate 那边选择 `Engine analysis`，根据提示步骤在根目录编写 Code Climate 配置文件 `.codeclimate.yml`：

```yaml
# 启用 eslint
eslint:
    enabled: true

# 设定要进行评级的代码
ratings:
    paths:
        - src/**/*.js
```

之后在 Code Climate 当前项目旁边的 Set Up Coverage 按钮上戳一下，在页面最底部获得用于 Travis CI 连接 Code Climate 上该项目用的 repo_token，将其写入根目录的 Travis CI 的配置文件 `.travis.yml`：

```yaml
addons:
    code_climate:
        repo_token: balabalabalashaaa
```

最后是接着编辑 Travis CI 的配置文件 `.travis.yml`，让 Travis CI 自动跑测试，同时报告测试覆盖率到 Code Climate：

```yaml
# 指定程序语言
language: node_js

# 指定 node 版本，“node” 为最新的稳定版本
node_js:
    - 'node'

# 启用 MongoDB
services:
    - mongodb

# 跑之前先安装依赖
install:
    - npm install codeclimate-test-reporter
    - npm install

# 执行 gulp 直接开跑
script: gulp

# 跑完报告测试覆盖率
after_script:
    - codeclimate-test-reporter < coverage/lcov.info
```

至此，项目在 Github 上每遭到 push 一次，Travis CI 和 Code Climate 就会自动对你的代码进行测试并报告结果咯～关于 CI 还有很多的用途可以探索哟。
