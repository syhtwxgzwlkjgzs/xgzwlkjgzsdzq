import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import initializeStore from '@common/store';
import './app.scss';

const store = initializeStore();

class App extends Component {
  componentDidMount() {}

  /**
   * 在小程序环境中对应 app 的 onLaunch
   *
   * @param {object} options 程序初始化参数
   * @param {string} options.path 启动小程序的场景值
   * @param {number} options.scene 启动小程序的 query 参数
   * @param {string} options.shareTicket 转发信息
   * @param {object} options.referrerInfo 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}
   * @param {string} options.referrerInfo.appId 来源小程序，或者公众号（微信中）
   * @param {object} options.referrerInfo.extraData 来源小程序传过来的数据，微信和百度小程序在 scene=1037 或 1038 时支持
   * @param {string} options.referrerInfo.sourceServiceId 来源插件，当处于插件运行模式时可见。
   * 注意：options 参数的字段在不同小程序中可能存在差异。所以具体使用的时候请看相关小程序的文档
   */
  onLaunch(options) {
    console.log(options);
  }

  /**
   * 程序启动，或切前台时触发，和 onLaunch 生命周期一样
   * @param {object} options 程序初始化参数
   * 参数于 onLaunch 中获取的基本一致，如上；但百度小程序中补充两个参数如下（具体在使用的时候需要自测）：
   * @param {string} options.entryType 展现的来源标识
   * @param {string} options.appURL 展现时的调起协议，仅当 entryType 值为 schema 时存在
   */
  componentDidShow(options) {
    console.log('show', options);
  }

  /**
   * 程序切后台时触发
   */
  componentDidHide() {}

  componentDidCatchError() { }

  /**
   * 程序要打开的页面不存在时触发
   * @param {object} options 参数
   * @param {string} options.path 不存在页面的路径
   * @param {object} options.query 打开不存在页面的query参数
   * @param {boolean} options.isEntryPage 是否本次启动的收个页面（例如从分享等入口进来，收个页面是开发者配置的分享页面）
   */
  onPageNotFound(options) {
    console.log('page not found', options);
  }

  render() {
    return (
      <Provider {...store}>
        {/* this.props.children 就是要渲染的页面 */}
        {this.props.children}
      </Provider>
    );
  }
}

export default App;
