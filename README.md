# Vue multi-page

## tools

- ### webpack4

- ### babel7

- ### vue-loader15

## scripts

> ### npm run dev 开发模式

#### 访问地址

- [history 模式: http://0.0.0.0:8080/${domain}/${projectName}/home](http://0.0.0.0:8080/serverApp/topic/home)
- [hash 模式: http://0.0.0.0:8080/${domain}/${projectName}/#/home](http://0.0.0.0:8080/serverApp/activity/#/home)

> ### npm run build 生产模式

## feature

- ### 多个 spa 项目共用一套 webpack 打包工具

- ### 所有公共资源只打包一份，避免相同资源重复打包

- ### 每一个 spa 项目仅引入自身需要的 bundle（避免上下文互相污染）

- ### dev 模式，支持黑白名单配置（可 watch 任意多个项目）

- ### dev 模式，webpack 只打包 watch 的项目资源（可加快打包速度）

- ### multi-page 提供 config.js，与 webpack 和每一个 spa 项目无缝衔接

- ### 每一个 spa 项目提供 config.js，与 webpack 无缝衔接

## dist

```js
├── activity                                            -----activity项目
│   ├── index.html                                      -----html入口
│   └── static                                          -----项目资源
│       └── js                                          -----js资源
│           ├── activity.70813a36eb5dfe3a932b.js        -----entry入口
│           ├── async                                   -----异步chunk的bundle目录
│           └── common                                  -----公共bundle目录
│               ├── async.44462b832164f1d8b0d2.js       -----异步chunk的公共bundle
│               └── initial.23423786b89723bn98.js       -----入口的公共bundle
│
├── static                                              -----公共资源
│   └── js                                              -----js资源
│       ├── common                                      -----公共bundle目录
│       │   ├── async.44462b832164f1d8b0d2.css          -----异步chunk的bundle样式
│       │   └── async.44462b832164f1d8b0d2.js           -----异步chunk的bundle
│       ├── runtime.87712839d5214552a4ce.js             -----manifest
│       └── vendor.59bdbd89d62d8a29335a.js              -----nodule_modules
│
└── topic
    ├── index.html
    └── static
        └── js
            ├── async
            ├── common
            └── topic.c806cfb5d270197c270c.js
```

## structure

> ### src

```js
├── common                         ---------公共方法
│   └── js
│     └── utils
├── components                     ---------公共组件
│   └── splitLine
├── config.js                      ---------公共配置文件
│
└── pages                          ---------项目目录(每一个项目均为spa)
    │
    ├── activity                   ---------activity项目
    │   ├── app.vue                ---------wrapper
    │   ├── common                 ---------项目中的公共方法
    │   ├── components             ---------项目中的公共组件
    │   ├── config.js              ---------项目中的配置文件
    │   ├── index.html             ---------项目中的html入口
    │   ├── main.js                ---------项目中的js入口
    │   ├── router                 ---------项目中的router
    │   │   ├── index.js
    │   │   └── routes
    │   └── views                  ---------项目中的页面
    │
    └── topic
        ├── app.vue
        ├── common
        ├── components
        ├── config.js
        ├── index.html
        ├── main.js
        ├── router
        │   ├── index.js
        │   └── routes
        └── views
```

## config

> ### 公共配置文件 config.js

```js
module.exports = {
  // 域路径 整个multi-page工程放在服务器中的目录路径
  domain: 'serverApp',
  // 开发模式下的黑白名单，白名单优先级高于黑名单
  dev: {
    whiteList: [
      'topic', // 项目配置文件中的name字段，默认为该项目的folder name
    ],
    blackList: [''],
  },
};
```

> ### 项目配置文件 例如： topic/config.js

```js
module.exports = {
  // 项目名称
  name: 'topic',
  // webpack entry入口
  main: 'main.js',
  // vue-router的配置
  vueRouter: {
    // 兼容history和hash模式
    mode: 'history',
  },
};
```

> ### vue-router 配置文件 例如： topic/router/index.js

```js
import Vue from 'vue';
import Router from 'vue-router';
import globalConfig from '@/config';
import config from 'topic/config';
import routes from './routes';

Vue.use(Router);

// 公共配置文件中的域
const { domain = '' } = globalConfig;
// 项目配置文件中的项目名称，vue-router部分
const { name: projectName = '', vueRouter: { mode = 'hash' } = {} } = config;

export default new Router({
  mode,
  // history模式可用，hash模式无用
  base: `/${domain}/${projectName}/`,
  routes,
});
```

> ### postcss 配置文件 例如： postcss.config.js

```js
module.exports = {
  plugins: [
    require('precss')(),
    require('autoprefixer')({
      browsers: ['> 1%', 'last 2 versions'],
    }),
    require('postcss-px-to-viewport')({
      viewportWidth: 375,
      viewportHeight: 667,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
    }),
  ],
};
```

> ### .babelrc 配置文件 例如： .babelrc

```js
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }]
  ],
  "plugins": ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-transform-runtime"]
}
```
