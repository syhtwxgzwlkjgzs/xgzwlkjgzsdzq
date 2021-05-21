/**
 * 跳转到登录页，可携带参数
 * 默认跳转回调用页面
 * 参数通nextjs router对象
 * 具体见：https://nextjs.org/docs/api-reference/next/router#router-object
 */

import Router from '@discuzq/sdk/dist/router';
import browser from './browser';
import config from '../config/index';

function getWeiXinLoginPath(redirectPath) {
  const basePath = '/apiv3/users/wechat/h5.oauth?redirect=';
  let redirectUri = `https://${window.location.host}/user/wx-auth`;
  redirectUri += (redirectPath ? `?redirectPath=${redirectPath}` : '');
  return basePath + encodeURIComponent(redirectUri);
}

function getH5LoginPath(redirectPath) {
  let h5LoginPath = '/user/login';
  h5LoginPath += (redirectPath ? `?redirectPath=${encodeURIComponent(redirectPath)}` : '');
  return h5LoginPath;
}

export default function goToLoginPage(options) {
  // 默认跳转路径
  const { pathname, search: query, hash } = window.location;
  const loginPath = browser.env('weixin') ? getWeiXinLoginPath(pathname) : getH5LoginPath(pathname);
  Router.push({
    pathname: loginPath,
    query,
    hash,
    ...options,
  });
}
