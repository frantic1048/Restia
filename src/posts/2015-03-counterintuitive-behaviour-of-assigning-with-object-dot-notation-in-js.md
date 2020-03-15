---
date: 2015-03-07
title: JS 中用字面语法设置对象属性时的“反直觉”行为
tags: [Javascript]
category: Tech
---

```javascript
myObject.foo = 233
```

服用《You Don't Know JS this and Object Prototypes》后，现在看到这句是再也不敢认为结果一定是 `myObject` 上有了一个名为 `foo`，值为 `233` 的属性了。

具体执行的结果还要看具体情形来决定。

如果 `myObject` 已经有一个名为 `foo` 的普通的属性了，那么执行的结果就是给 `myObject` 现有的 `foo` 属性进行了一次赋值。

然而 `myObject` 上面找不到 `foo`，那就和访问一个对象本身不存在的属性一样，JS 会一级一级地扒 `myObject` 的原型链最终确定 `foo` 的存在情况，从而来决定执行结果。

-   如果原型链上也没有 `foo`，那么就直接在 `myObject` 上添加一个 `foo` 属性并赋值。

-   原型链上找到了 `foo`，并且它是可写的（`writable:true`），那么也是直接在 `myObject` 上添加一个 `foo` 属性并赋值，从而原型链上的 `foo` 被遮盖了。

-   原型链上找到了 `foo`，但它是只读的（`writable:false`），那什么都不会发生，`myObject` 上不会多一个 `foo` 属性，原型链上的那只 `foo` 也不会改变；如果你处在严格模式的话，JS 会顺便给你抛一个错误。

-   原型链上找到了名为 `foo` 的 `Setter`，这个时候始终会调用找到的那个 `Setter`，`myObject` 上不会创建新属性，`Setter` 也不会被重新赋值。

还是来看直观的代码吧 ╮(￣ ▽ ￣)╭

```javascript
var Shoujo = Object.defineProperties(
    {},
    {
        hairColor: { value: 'black', writable: true, enumerable: true, configurable: true },
        isReachable: { value: false, writable: false, enumerable: true, configurable: true },
        makeUpCode: {
            set: function(value) {
                console.log(value + ' Henshin !')
            },
            enumerable: true,
            configurable: true,
        },
    },
)

var A = Object.create(Shoujo)

A.magicType = 'dark'
/*全新的属性，直接添加到原来的对象身上
Shoujo -> { hairColor: "black", isReachable: false, makeUpCode: undefined }
A -> { magicType: "dark" } 
*/

A.hairColor = 'silver'
/*原型链上既有的普通属性，也是直接添加到原来的对象身上
Shoujo -> { hairColor: "black", isReachable: false, makeUpCode: undefined }
A -> { magicType: "dark", hairColor: "silver" }
*/

A.isReachable = true
/*原型链上既有的只读属性，什么都没有发生 ˊ_>ˋ
Shoujo -> { hairColor: "black", isReachable: false, makeUpCode: undefined }
A -> { magicType: "dark", hairColor: "silver" }
*/

A.makeUpCode = 'I am the bone of my...'
//"I am the bone of my... Henshin !"
/*原型链上既有的 Setter，调用 Setter
Shoujo -> { hairColor: "black", isReachable: false, makeUpCode: undefined }
A -> { magicType: "dark", hairColor: "silver" }
*/
```

另外，`['propertyName']` 这种语法和 `.propertyName` 一样也遵循上面的行为。

当然，这些行为不会影响你使用 `Object.defineProperty()` 和 `Object.defineProperties()` 来设置对象的属性。
