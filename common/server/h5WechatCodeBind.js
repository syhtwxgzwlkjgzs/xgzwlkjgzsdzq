import api from './api';
export default async function h5WechatCodeBind(opts, ctx) {
  const res = await api.h5WechatCodeBind({ ...opts, __context: ctx });
  return res;
}
