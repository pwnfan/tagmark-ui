# 1. TagMark Filters

- [1. TagMark Filters](#1-tagmark-filters)
  - [1.1. 如何确定 Filter 类型](#11-如何确定-filter-类型)
  - [1.2. Advanced Filter](#12-advanced-filter)
  - [1.3. 其他类型 Filter](#13-其他类型-filter)
  - [1.4. 辅助输入 tag](#14-辅助输入-tag)
  - [1.5. 通过 URL 参数使用 filter](#15-通过-url-参数使用-filter)
  - [1.6. 参考链接](#16-参考链接)

## 1.1. 如何确定 Filter 类型

## 1.2. Advanced Filter

Advanced Filter 是我们针对 tags 搜索的需求定制的 Filter，因为 Tabulator 中内置的 Filter 无法满足我们的需求。

Advanced Filter 中定义了如下的关键字（运算符）:

- `AND`: 必须大写，表示 "与" 逻辑，它类似于Javascript 中的 `&&` 逻辑运算符。
- `OR`: 必须大写，表示 "或" 逻辑，它类似于Javascript 中的 `||` 逻辑运算符。
- `(` 和 `)`: 用来组合多个表达式，并控制它们的优先级。它的用法与大多数编程语言中的用法一致。

**Advanced Filter 中输入的字符串不需要使用 `"` 或者 `'` 括起来。**

下面给出一些使用示例：

## 1.3. 其他类型 Filter

## 1.4. 辅助输入 tag

在 `Tags` 列加入了辅助输入 tag 功能，当用鼠标单击任何一个 tag 时，会将此 tag 自动输入到 Tags 列的 header filter 的 input 输入框中。

另外，在 `All Tags` 浮层页面，这种辅助输入 tag 的方式同样有效：

需要特别指出到是，这种辅助输入到方式仅对 `Tags` 列有效，其他列无效，尤其是 `Github Info` > `Topics` 列也未添加此功能。

## 1.5. 通过 URL 参数使用 filter

## 1.6. 参考链接

- Tabulator Document
  - [Custom Filter Functions](https://tabulator.info/docs/5.4/filter#func-builtin)
  - [Header Filtering](https://tabulator.info/docs/5.4/filter#header)
