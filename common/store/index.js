import { useStaticRendering } from 'mobx-react';
import SiteStore from './site';
import app from './app';
import index from './index';
import isServerFn from '@common/utils/is-server';

const isServer = isServerFn();
useStaticRendering(isServer);

let store = null;

export default function initializeStore(initProps = {}) {
  const { site } = initProps;

  const initStore = {
    site: new SiteStore({
      ...site,
    }),
    app,
    index,
  };
  if (isServer) {
    return initStore;
  }
  if (store === null) {
    store = initStore;
  }
  return store;
}
