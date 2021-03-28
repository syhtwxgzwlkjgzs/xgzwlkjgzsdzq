/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import isServer from './is-server';
import formatCookie from '@common/utils/format-cookie';
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
      const cookieData = formatCookie(document.cookie);
      token = cookieData.access_token || undefined;
      // 小程序
    } else {

    }
  }

  if (token) {
    config.headers = config.headers ? { ...config.headers, authorization: `Bearer ${token}` } : { authorization: `Bearer ${token}` };
  }
  return config;
}
