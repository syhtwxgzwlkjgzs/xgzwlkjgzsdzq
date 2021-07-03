## 环境

建议使用环境如下：
- node: 14.x.x
- npm: 6.14.x

## 使用

建议使用git clone命令进行下载，方便后续更新。

```bash
$ git clone https://gitee.com/Discuz/discuz-fe.git
```

## 安装项目依赖

```bash
$ cd ./mini
$ npm install
```

如果遇到下载依赖失败可以尝试先运行如下命令,更改安装依赖的源地址
```bash
// 单次生效
$ npm install --registry=http://mirrors.cloud.tencent.com/npm/
// 永久生效
$ npm config set registry http://mirrors.cloud.tencent.com/npm/
```

如果遇到以下问题：
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! While resolving: discuz-app-mini@0.0.1-beta.3
npm ERR! Found: react@17.0.1
npm ERR! node_modules/react
npm ERR!   react@"17.0.1" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^16.8.0 || 16.9.0-alpha.0" from mobx-react@6.1.4
npm ERR! node_modules/mobx-react
npm ERR!   mobx-react@"6.1.4" from the root project
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR! 
npm ERR! See /Users/samwu/.npm/eresolve-report.txt for a full report.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/xxx/.npm/_logs/2021-07-02T17_24_15_418Z-debug.log
```

可以尝试使用以下命令：
```bash
npm cache clean --force && npm i --legacy-peer-deps
```

## 小程序构建

- 修改`project.config.json`文件中的appid为自己的appid
- 修改`prod.js`中的域名指向

```js
module.exports = {
  TITLE: 'Discuz!Q',
  COMMON_BASE_URL: process.env.DISCUZ_ENV === 'web' ? '' : '你的网站域名',
};
```
- 进行小程序编译

```bash
$ cd ./mini
$ npm install
$ npm run build:weapp
```