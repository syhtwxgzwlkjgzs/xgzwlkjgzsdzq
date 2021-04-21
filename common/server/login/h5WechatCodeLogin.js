import api from '../api';
export default async function h5WechatCodeLogin(opts, ctx) {
  const res = await api.h5WechatCodeLogin({ ...opts, __context: ctx });
  return res;
}
