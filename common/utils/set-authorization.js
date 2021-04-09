/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import isServer from './is-server';
import formatCookie from '@common/utils/format-cookie';
import LocalBridge from '@discuzq/sdk/src/localstorage';
// 兼容旧项目中的一些信息获取
const ACCESS_TOKEN_NAME = 'access_token';
const localBridgeOptions = { prefix: '' };
const locals = new LocalBridge(localBridgeOptions);

export default function setAuthorization(config) {
  let token;
  if (isServer() && config.__context) {
    const { headers } = config.__context.req;
    const { cookie } = headers;
    const cookieData = formatCookie(cookie);
    token = cookieData.access_token || undefined;
    delete config.__context;
  } else {
    // web端
    if (process.env.DISCUZ_ENV === 'web') {
      token = locals.get(ACCESS_TOKEN_NAME);
    } else {
      // 小程序登录态处理
      token = locals.get(ACCESS_TOKEN_NAME);
    }
  }

  if (token) {
    config.headers = config.headers ? { ...config.headers, authorization: `Bearer ${token}` } : { authorization: `Bearer ${token}` };
  }
  return config;
}
