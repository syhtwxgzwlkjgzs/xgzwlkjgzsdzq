import api from '../api';
export default async function h5WechatCodeLogin(opts, ctx) {
  // 不需要设置登录态
  const res = await api.h5WechatCodeLogin({ ...opts, __context: ctx, _noSetAuthorization: true });
  return res;
}
