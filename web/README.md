# Discuz!Q（Web）

Discuz!Q web站点项目工程

## 构建命令

```bash
// 本地开发
npm run dev

// 构建站点
npm run build

// 静态化部署
npm run static

// 运行SSR服务
npm run start
```

构建命令中，输出的构建后文件会固定以`package.json`的`name`属性作为文件名。

例如`package.json`的`name`属性为`dzq-default-web`，那么使用`npm run build`输出的文件为`dzq-default-web`，执行那么使`npm run static`输出的文件为`dzq-default-web-static`。


## 目录结构

```

|——components                    公共组件
|——layout                        页面布局组件
|   └──index                     index页面组件
|   |   └──h5                    移动端布局组件
|   |   |   └──commponents       私有组件
|   |   |   |   └──...
|   |   |   └──index.jsx         入口
|   |   └──pc                    pc端布局组件
|   |   |   └──commponents
|   |   |   |   └──...
|   |   |   └──index.jsx
|   └──detail
|   └──...
|——config                        配置文件
|   └──dev.js                    开发环境配置文件
|   └──prod.js                   生产环境配置文件
|   └──index.js                  主入口文件
|——pages                         页面目录
|   └──detail
    |   └──index.jsx
|   └──...
|   └──_app.js                   App主应用
|   └──_document.jsx             html配置
|   └──404.jsx                   404文件
|   └──index.jsx                 首页
|——public                        静态资源
|——server                        接口文件
|——store                         状态管理
|——styles                        全局样式配置
|——utils                         工具函数
```

## 环境配置

通过config中的文件，配置应用环境变量传入运行时。

```js
module.exports = {
  host: 'https://www.tencent.com',
};
```

在构建时，会自动将变量注入到`store`中，获取方式如下：
```js
@inject('site')
@observer
class Index extends React.Component {
  render() {
    const { site } = this.props;
    const { envConfig } = site;
    console.log(envConfig.host) // ===  'https://www.tencent.com'
    if ( platform === 'h5' ) {
      return <IndexH5Page/>;
    } else {
      return <IndexPCPage/>;
    }
  }
}

export default Index;
```
> envConfig建议只读，不应该在运行时修改envConfig中的任何数据

## 页面开发规范

在`pages`文件中，只编写页面路由级别的页面代码，以及数据获取，具体的布局和交互组件，应该通过编写在`layout`中实现。

```jsx
import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories } from '@server';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {

  constructor(props) {
    super(props);
    const { server_index, index } = this.props;
    // 初始化数据到store中
    server_index.categories && index.setCategories(server_index.categories);
  }

  async componentDidMount() {
    const { server_index, index } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    if ( !server_index.categories ) {
      const categories = await readCategories();
      index.setCategories(categories.data);
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    // 判断是移动端还是pc端，将使用不用布局组件进行渲染
    if ( platform === 'h5' ) {
      return <IndexH5Page/>;
    } else {
      return <IndexPCPage/>;
    }
  }
}

export default Index;

// SSR获取数据，提供给服务器渲染
export async function getServerSideProps(context) {
  // 获取分类数据
  const categories = await readCategories();
  return {
    props: {
      // 规范的命令，如果绑定的store名称为index，那么SSR返回的应该为server_index
      // 其他参数应该与浏览器渲染传入的变量名称保持一致
      server_index: {
        categories: categories.data
      }
    },
  }
}

```

因为h5和pc是区分布局独立实现的，但是如何公用业务逻辑，以及分别实现页面交互呢？每个页面的`store`和`state`的边界如何确定？

- `store`应该是页面级别的数据状态，不涉及任何移动端与pc端的交互状态存储。
- `state`应当存放当前页面交互级别的状态，交互级别的数据，例如`isShow`这类型的状态，不应该存放到store中，应该当前组件自行处理。


## 服务编写

每个请求应该在`server`目录下，单个请求单个文件，因为需要再SSR和CSR中公用。


## 状态管理

状态管理除了公共的状态，例如`site`,`user`外，应该没有个页面都有一个自己的store，用于保持该页面的数据，以及数据修改和服务端交互。

## 布局单位

根据设计稿按照`375px`设计，兼容pc与h5的单位统一，使用`rem`作为计算单位。具体规则如下：
- 屏幕宽度小于320px，将使用统一使用320作为基数计算。
- 屏幕宽度大于750px，将使用统一使用750作为基数计算。
- 屏幕范围在320px~750px之间，包含（320和750），将会自动等比缩放。

在开发过程中，将直接计算`100/x`等于实际`rem`单位。例如：设计稿10px，那么相当于`100/10=.1rem`。

## 样式编写

所有页面的样式文件，必须以`xxx.module.scss`进行编写。Discuz!Q作为一个SPA应用，将使用`SCSS Module`来实现样式作用域保护。

## 引用规则

dzq-cli将为开发者提供快速引用指定目录的方式。

- @component
- @layout
- @utils
- @pages
- @store
- @config
- @server


```js
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories } from '@server';
```