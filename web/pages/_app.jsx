import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import PayBoxProvider from '../components/payBox/payBoxProvider';
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
      <div data-dzq-theme="light">
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
