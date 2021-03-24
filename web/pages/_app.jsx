import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import '../styles/index.scss';
import getPlatform from '@common/utils/get-platform';
import isServer from '@common/utils/is-server';

class DzqApp extends App {
  // 应用初始化
  static async getInitialProps(appContext) {
    // eslint-disable-next-line no-param-reassign

    // const siteConfig = await api.http({
    //   url: 'http://0.0.0.0:9527/api/site', // 请求地址
    //   method: 'GET'
    // });
    // console.log(siteConfig);
    // console.log(appContext?.ctx?.pathname);
    let platform;
    if (isServer()) {
      const { ctx } = appContext;
      const { headers } = ctx.req;
      platform = getPlatform(headers['user-agent']);
    } else {
      platform = getPlatform(window.navigator.userAgent);
    }

    const site = { platform };

    const appStore = initializeStore({
      site,
    });
    // eslint-disable-next-line no-param-reassign
    appContext.ctx.appStore = appStore;
    return {
      initialAppStore: appStore,
    };
  }

  constructor(props) {
    super(props);
    this.appStore = isServer() ? props.initialAppStore : initializeStore({
      site: {
        platform: getPlatform(window.navigator.userAgent),
      },
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    // todo 路由鉴权
    return (
      <Provider {...this.appStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default DzqApp;
