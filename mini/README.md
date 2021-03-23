# Discuz! Q (mini)

> Discuz! Q 小程序站点项目工程

![node version](https://img.shields.io/badge/node-%3E%3D10.13.0-blue)
![MobX 4](https://img.shields.io/badge/MobX-4.15.4-brightgreen)
![Taro 3](https://img.shields.io/badge/Taro-3.1.1-brightgreen)

## 使用

说明：目前 `@discuz/cli` 安装有问题

```bash
# 安装依赖
$ npm install

# 本地开发
$ npm run dev:weapp

# 构建
$ npm run build:weapp
```

## 目录结构

```bash
|- config               # 项目编译配置
| |- dev.js             # 开发环境配置文件
| |- index.js           # 默认配置
| |- prod.js            # 生产环境配置文件
|- src                  # 源代码
| |- components         # 业务组件
| | |- ...
| |- pages              # 页面
| | |- index
| | | |- component      # 独属于该页面的组件
| | | |- index.jsx
| | |- ...
| |- styles             # 样式
| | |- index.scss         # 样式入口文件
| | |- reset.scss         # 重置样式
| |- utils              # 共用的工具函数
| |- app.config.js      # 应用页面配置入口文件
| |- app.jsx            # 全局入口文件
| |- app.scss           # 全局样式入口
```

## 环境配置

通过 `config` 文件夹中的文件中的 `defineConstants`。具体请看：[taro defineConstants](https://taro-docs.jd.com/taro/docs/next/config-detail#defineconstants)。

## 数据状态管理

使用 [`MobX 4`](https://cn.mobx.js.org) 进行数据状态管理，具体使用文档请看：[MobX 4 API](https://cn.mobx.js.org/refguide/api.html)。

## 页面开发规范

1. [命名规范](.。/docs/naming.md)

2. 各司其职

> 说明：根据**目录结构**给出来的目录说明，将不同职责的模块放入在不同目录中实现。比如：

- `pages` 目录中存放页面。如果某些组件是只属于该页面的，就需要在对应的页面下面新建 `components` 目录，用于存放页面组件
- `styles` 目录中存放共用的样式
- `comoponents` 目录中存放公共组件
- `utils` 是工具函数目录，一个功能函数对应一个文件

1. 页面分包问题
> 说明:
> 分包的入口文件：`./src/app.config.js`
> 分包打包优化：`./config` 文件夹下面的文件
- 主包：只包含首页和详情页
- 子包：除首页和详情页的包都在子包

## 布局单位

设计稿按照 `375px` 进行设计。在项目中尺寸单位建议使用 px、 百分比 %，Taro 默认会对所有单位进行转换。

## 引用规则

提供快速引用指定目录的方式。

- @constants：对应 `./src/constants`
- @component：对应 `./src/components`
- @utils：对应 `./src/utils`
- @pages：对应 `./src/pages`
- @store：对应 `./src/store`
- @styles：对应 `./src/styles`


## 依赖
- [Taro 3](http://taro-docs.jd.com/taro/docs/README)
- [MobX 4](https://cn.mobx.js.org/)
