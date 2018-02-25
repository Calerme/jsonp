
# jsonp

一个基于 ES6 语法创建的 jsonp 库，

# 用法介绍

通过 npm 进行安装：

``` bash
$ npm install jsonp
```

直接引入 js 文件：

```js
import jsonp from 'jsonp'
```

## API

### jsonp(url, opts, fn)

- `url` (`String`) 请求的地址
- `data` （`Object`) query 对象
- `opts` (`Object`) jsonp 的一些参数
  - `param` (`String`) 指定 jsonp 回调函数的键值（默认为 `callback`）
  - `timeout` (`Number`) 限定多长时间（单位：毫秒）无响应后，jsonp 取消操作，并返回一个 “Timeout” 的错误(默认值为 `60000`)
  - `prefix` (`String`) jsonp 回调函数名的前缀 (默认为 `__jp`)
  - `name` (`String`) jsonp 回调函数名 (默认为 `prefix` + 计数器)

jsonp 执行后返回一个 `Promise` 对象，接收到的数据将传入 then 的 resolve 回调函数。

示例：

```js
import jsonp from 'jsonp';

jsonp('api.example.com', {
  name: 'John',
  age: 27
}, {
  prefix: 'jsonp',
  param: 'cb'
})
.then((data) => {
  // 具体操作数据的代码...
})
```