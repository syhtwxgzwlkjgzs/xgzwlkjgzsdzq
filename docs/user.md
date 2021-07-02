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