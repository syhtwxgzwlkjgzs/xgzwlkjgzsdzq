import React from 'react';
import { Provider } from 'mobx-react';
import { hideInstance } from '@discuzq/design/dist/components/image-previewer/layouts/web';
import App from 'next/app';
import initializeStore from '@common/store';
import Head from 'next/head';
import PayBoxProvider from '../components/payBox/payBoxProvider';
import isServer from '@common/utils/is-server';
import '@discuzq/design/dist/styles/index.scss';
import csrRouterRedirect from '@common/utils/csr-router-redirect';
import Router from '@discuzq/sdk/dist/router';
import sentry from '@common/utils/sentry';
import '../styles/index.scss';

if ( !isServer() ) {
  sentry();
}

class DzqApp extends App {
  constructor(props) {
    super(props);
    this.appStore = initializeStore();
  }

  // 路由跳转时，需要清理图片预览器
  cleanImgViewer = () => {
    try {
      if (hideInstance) {
        hideInstance();
      }
    } catch (e) {
      console.error(e);
    }
  };

  listenRouterChangeAndClean() {
    // FIXME: 此种写法不好
    if (!isServer()) {
      window.addEventListener('popstate', this.cleanImgViewer, false);
    }
  }

  componentDidMount() {
    csrRouterRedirect();
    this.listenRouterChangeAndClean();
  }

  componentWillUnmount() {
    if (!isServer()) {
      window.removeEventListener('popstate', this.cleanImgViewer);
    }
  }

  // 出错捕获
  componentDidCatch(error, info) {
    Router.replace({url: '/render-error'});
  }

  render() {
    const { Component, pageProps } = this.props;
    const { site } = this.appStore;
    return (
      <div data-dzq-theme="light">
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
          />
          <title>{(site.envConfig && site.envConfig.TITLE) || 'Discuz!Q'}</title>
        </Head>
        <Provider {...this.appStore}>
          <PayBoxProvider>
            <Component {...pageProps} />
          </PayBoxProvider>
        </Provider>
      </div>
    );
  }
}

export default DzqApp;
