# Discuz! Q 项目

## 使用
> 说明：目前 `@discuz/cli` 安装没有发布包，所以本地测试的时候，`discuz-core`项目中的 `discuz-cli` 目录下面使用 `npm link` 进行关联

```bash
# 安装依赖
$ npm run ins

# web 端本地开发
$ npm run dev:web

# 小程序端本地开发
$ npm run dev:mini
```

## 目录结构

```bash
|- common             # 小程序和 web 端公用的一些内容
| |- config           # 项目编译配置
| | |- dev.js             # 开发环境配置文件
| | |- index.js           # 默认配置
| | |- prod.js            # 生产环境配置文件
| |- constants        # 常量
| | |- site.js            # 项目构建时通过 defineConstants 定义的变量存放在此处
| | |- app.js             # 项目中
| |- server           # 请求
| |- store            # 数据状态管理
| | |- app                # 项目的全局状态管理，比如：主题、页面状态等
| | |- site               # 项目中的基本状态管理，比如：构建时定义的变量
| | |- index              # 页面的状态管理
| | |- ...
| |- styles           # 样式
| |- utils            # 工具库
|- mini               # 小程序项目
|- web                # web 项目
```

## 开发规范

1. [命名规范](./docs/naming.md)

TODO: 待补充
