import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';
import initializeStore from '@common/store';
import {readForum, readUser, readPermissions} from '@server';
import Router from '@discuzq/sdk/dist/router';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro'
import clearLoginStatus from '@common/utils/clear-login-status';
import { Icon } from '@discuzq/design';
import '@discuzq/design/dist/components/icon/styles/index.scss';
import './app.scss';

class App extends Component {

  store = initializeStore();

  async componentDidMount() {

  }

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
  async onLaunch(options) {
    this.initSiteData();
  }

  /**
   * 程序启动，或切前台时触发，和 onLaunch 生命周期一样
   * @param {object} options 程序初始化参数
   * 参数于 onLaunch 中获取的基本一致，如上；但百度小程序中补充两个参数如下（具体在使用的时候需要自测）：
   * @param {string} options.entryType 展现的来源标识
   * @param {string} options.appURL 展现时的调起协议，仅当 entryType 值为 schema 时存在
   */
  componentDidShow(options) {
  }

  /**
   * 程序切后台时触发
   */
  componentDidHide() {}

  /**
   * 程序要打开的页面不存在时触发
   * @param {object} options 参数
   * @param {string} options.path 不存在页面的路径
   * @param {object} options.query 打开不存在页面的query参数
   * @param {boolean} options.isEntryPage 是否本次启动的收个页面（例如从分享等入口进来，收个页面是开发者配置的分享页面）
   */
  onPageNotFound(options) {
    Router.redirect({
      url: '/subPages/404/index'
    });
  }

  // 初始化站点数据
  async initSiteData() {
    const { site, user } = this.store;
    site.setPlatform('mini');

    // 获取站点信息
    const siteResult = await readForum({});

    // 检查站点状态
    const isPass = this.setAppCommonStatus(siteResult);
    if(!isPass) return;

    siteResult.data && site.setSiteConfig(siteResult.data);

    if( siteResult && siteResult.data && siteResult.data.user ) {

      const userInfo = await readUser({ params: { pid: siteResult.data.user.userId } });
      const userPermissions = await readPermissions({});

      // 添加用户发帖权限
      userPermissions.code === 0 && userPermissions.data && user.setUserPermissions(userPermissions.data);
      // 当客户端无法获取用户信息，那么将作为没有登录处理
      userInfo.code === 0 && userInfo.data && user.setUserInfo(userInfo.data);
    }
  }

  // 检查站点状态
  setAppCommonStatus(result) {
    switch (result.code) {
      case -3005: site.setCloseSiteConfig(result.data);
        Router.redirect({
          url: '/subPages/close/index'
        });
        return false;
      case -4002:
        clearLoginStatus();
        this.initSiteData(); // 重新获取数据
        return false;
    }
    return true;
  }

  render() {
    const { children } = this.props;
    return (
      <Provider {...this.store}>
        {/* this.props.children 就是要渲染的页面 */}
        {children}
      </Provider>
    );
  }
}

export default App;
