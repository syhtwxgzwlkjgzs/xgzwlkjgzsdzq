import { useStaticRendering } from 'mobx-react';
import { ENV_CONFIG } from '@common/constants/site';
import isServer from '@common/utils/is-server';
import SiteStore from './site/action';
import IndexStore from './index/action';
import UserStore from './user/action';

useStaticRendering(isServer());

let store = null;

export default function initializeStore(initProps = {}) {
  const { site = {}, user= {} } = initProps;
  if (isServer()) {
    return {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site,
      }),
      index: new IndexStore(),
      user: new UserStore(user),
    };
  }
  if (store === null) {
    store = {
      site: new SiteStore({
        envConfig: ENV_CONFIG,
        ...site,
      }),
      index: new IndexStore(),
      user: new UserStore(user),
    };
  }

  return store;
}
