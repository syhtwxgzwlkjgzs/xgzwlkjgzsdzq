import api from './api';
export default async function smsLogin(opts, ctx) {
  const res = await api.smsLogin({ ...opts, __context: ctx });
  return res;
}
