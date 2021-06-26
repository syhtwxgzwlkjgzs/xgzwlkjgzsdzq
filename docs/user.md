## 环境

建议使用环境如下：
- node: 14.x.x
- npm: 6.14.x

## 使用

建议使用git clone命令进行下载，方便后续更新。

```bash
$ git clone https://gitee.com/Discuz/discuz-fe.git
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