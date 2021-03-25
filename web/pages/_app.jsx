import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import '../styles/index.scss';
import getPlatform from '@common/utils/get-platform';
import isServer from '@common/utils/is-server';

import {readForum} from '@server';

class DzqApp extends App {
  // 应用初始化
  static async getInitialProps(appContext) {
    let platform;
    if (isServer()) {
      const { ctx } = appContext;
      const { headers } = ctx.req;
      platform = getPlatform(headers['user-agent']);

      // 获取站点信息
      const siteConfig = await readForum({}, ctx);
      const site = { 
        platform,
        webConfig: siteConfig.data || null
     };

      const appStore = initializeStore({
        site,
      });
      // eslint-disable-next-line no-param-reassign
      appContext.ctx.appStore = appStore;
      return {
        initialAppStore: appStore,
      };
    } 
    return {}
  }

  constructor(props) {
    super(props);
    console.log('constructor');
    // 全局数据获取
    // 使用getInitialProps会导致next的自动静态化失效
    this.appStore = isServer() ? props.initialAppStore : initializeStore(props.initialAppStore);
  }

  async componentDidMount() {
    const { Component, pageProps } = this.props;
    // 检查必须有站点信息，否则不能正常使用站点
    if ( !this.appStore.site.webConfig ) {
      const siteConfig = await readForum({});
      siteConfig.data && this.appStore.site.setSiteConfig(siteConfig.data);
    }
  }

  isRenderSite() {
    const { Component, pageProps } = this.props;
    // 检查必须有站点信息，否则不能正常使用站点
    // todo 首次必须是loading，在浏览器中再次无法获取数据，那么再显示站点配置获取失败
    if ( !this.appStore.site.webConfig ) {
      return (<div>没有站点信息</div>);
    }
    return (<Component {...pageProps} />);
  }

  render() {
    // todo 路由鉴权
    return (
      <Provider {...this.appStore}>
        {
          this.isRenderSite()
        }
      </Provider>
    );
  }
}

export default DzqApp;
