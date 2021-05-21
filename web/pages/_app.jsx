import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import Head from 'next/head';
import PayBoxProvider from '../components/payBox/payBoxProvider';
import Router from '@discuzq/sdk/dist/router';
import '@discuzq/design/dist/styles/index.scss';
import '../styles/index.scss';

class DzqApp extends App {
  constructor(props) {
    super(props);
    this.appStore = initializeStore();
  }

  componentDidMount() {
    // if (process.env.DISCUZ_RUN === 'static') {
    //   // 当CSR出现末尾是index，会导致不能正确跳转的问题；
    //   let { pathname } = window.location;

    //   if (pathname !== '' || pathname !== '/') {
    //     const pathnameArr = pathname.split('/');
    //     if (pathnameArr[pathnameArr.length - 1] === 'index') {
    //       pathnameArr.pop();
    //       pathname = pathnameArr.join('/');
    //     }
    //   }
    //   // csr部署时因方便ngixn部署统一指向index.html,所以统一在此重定向一次
    //   Router.redirect({ url: `${pathname}${window.location.search}` });
    // }
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
          <title>{(site.envConfig && site.envConfig['TITLE']) || 'Discuz!Q' }</title>
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
