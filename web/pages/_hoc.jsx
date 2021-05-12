import { inject, observer } from 'mobx-react';
import { default as _HOCFetchSiteData } from '@common/middleware/HOCFetchSiteData';
import { default as _HOCWithLogin } from '@common/middleware/HOCWithLogin';

const HOCFetchSiteData = (component) => {
  return inject('site', 'user')(observer(_HOCFetchSiteData(component)));
}

const HOCWithLogin = (component) => {
  return inject('user')(observer(_HOCWithLogin(component)));
}

export { HOCFetchSiteData, HOCWithLogin };
