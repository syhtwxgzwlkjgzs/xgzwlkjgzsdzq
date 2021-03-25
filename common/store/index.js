import { useStaticRendering } from 'mobx-react';
import SiteStore from './site/action';
import IndexStore from './index/action';
import UserStore from './user/action';
import initEnvConfig from '@common/config';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

let store = null;
const ENV_CONFIG = initEnvConfig();

export default function initializeStore(initProps = {}) {

  const {site, index, user} = initProps;
  if (isServer) {
    return {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site
      }),
      index: new IndexStore(index),
      user: new UserStore(user)
    };
  }
  if (store === null) {
    store = {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site
      }),
      index: new IndexStore(index),
      user: new UserStore(user)
    };
  }

  return store;
}
