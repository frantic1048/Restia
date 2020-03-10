---
date: 2013-08-30
title: 在Linux下用GCC编译C程序
tags: [Linux, C, GCC]
category: Tech
---

得知第一学期似乎就要搞C了，以前没认真看过，今儿图书馆去翻了本Linux C的书，学会怎么编译先。

操作环境：Linux 3.10.9-1-ARCH

#安装GCC

Arch安装软件蛮简单的，直接在终端里面

    pacman -S gcc

就搞定了。

#使用GCC编译你的C程序

最简单的命令，就是

    gcc helloc.c -o hello.out

其中选项`-o`是指定输出文件位置，正常情况下，执行完之后生成的就是可以运行的二进制文件了。当然，因为这是Linux系统，你可能还需要运行`chmod +x hello.out`来赋予执行权限给输出的程序。

---

然后GCC还有一些其它的一些常见编译/优化/调试用的选项（参考书上的），这些就在接下来慢慢折腾吧。

<table border-collapse=collapse>
<tr><th>选项</th><th>作用</th><th>输出文件的默认后缀</th></tr>
<tr><td>-E</td><td>只完成预处理过程</td><td>.i</td></tr>
<tr><td>-S</td><td>在以上选项的基础上完成编译，生成汇编代码</td><td>.s</td></tr>
<tr><td>-c</td><td>在以上选项的基础上完成汇编，生成机器码（此时输出的文件还不能运行）</td><td>.o</td></tr>
<tr><td>-O0</td><td>输出给定源文件的所有依赖关系</td><td> - </td></tr>
<tr><td>-O，-O1</td><td>输出给定源文件的所有依赖关系</td><td> - </td></tr>
<tr><td>-O2</td><td>输出给定源文件的所有依赖关系</td><td> - </td></tr>
<tr><td>-O3</td><td>在以上的基础上</td><td> - </td></tr>
<tr><td>-Os</td><td>输出最小的可执行文件</td><td> - </td></tr>

<tr><td>-M</td><td>输出给定源文件的所有依赖关系</td><td> - </td></tr>
<tr><td>-MM</td><td>输出给定源文件的除了标准库头文件之外的依赖关系</td><td> - </td></tr>
<tr><td>-MD</td><td>输出给定源文件的所有依赖关系，同时编译生成可执行文件</td><td>.d(依赖关系文件) .out(可执行文件)</td></tr>
</table>