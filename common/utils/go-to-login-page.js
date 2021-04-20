/**
 * 跳转到首页，携带参数
 * 默认跳转回调用页面
 * 参数通nextjs router对象
 * 具体见：https://nextjs.org/docs/api-reference/next/router#router-object
 */

import Router from '@common/utils/web-router';
import isWeiXin from './is-wechat-browser';
import config from '../config/index';

function getWeiXinLoginPath(redirectPath) {
  const basePath = '/apiv3/users/wechat/h5.oauth?redirect=';
  let redirectUri = `${config.COMMOM_BASE_URL}/user/wx-auth`;
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
  const loginPath = isWeiXin() ? getWeiXinLoginPath(pathname) : getH5LoginPath(pathname);
  Router.push({
    pathname: loginPath,
    query,
    hash,
    ...options,
  });
}
