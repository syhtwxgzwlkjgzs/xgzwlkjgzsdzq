import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import '../styles/index.scss';

class DzqApp extends App {
  constructor(props) {
    super(props);
    this.appStore = initializeStore();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider {...this.appStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default DzqApp;
