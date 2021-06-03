import React from 'react';
import { Provider } from 'mobx-react';
import { hideInstance } from '@discuzq/design/dist/components/image-previewer/layouts/web';
import App from 'next/app';
import initializeStore from '@common/store';
import PayBoxProvider from '../components/payBox/payBoxProvider';
import isServer from '@common/utils/is-server';
import '@discuzq/design/dist/styles/index.scss';
import csrRouterRedirect from '@common/utils/csr-router-redirect';
import Router from '@discuzq/sdk/dist/router';
import sentry from '@common/utils/sentry';
import '../styles/index.scss';
import DocumentHead from '../components/documentHead';

if (!isServer()) {
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
    Router.replace({ url: '/render-error' });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <div data-dzq-theme="light">
        <Provider {...this.appStore}>
          <DocumentHead />
          <PayBoxProvider>
            <Component {...pageProps} />
          </PayBoxProvider>
        </Provider>
      </div>
    );
  }
}

export default DzqApp;
