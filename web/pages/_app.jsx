import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import Head from 'next/head';

import '@discuzq/design/dist/styles/index.scss';
import '../styles/index.scss';


class DzqApp extends App {
  constructor(props) {
    super(props);
    this.appStore = initializeStore();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <div data-dzq-theme='light'>
        <Head>
          <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"/>
        </Head>
        <Provider {...this.appStore}>
          <Component {...pageProps} />
        </Provider>
      </div>
    );
  }
}

export default DzqApp;
