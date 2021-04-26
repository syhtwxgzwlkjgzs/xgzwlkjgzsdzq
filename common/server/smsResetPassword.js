import api from './api';

export default async function smsResetPwd(opts, ctx = null) {
  const res = await api.smsResetPwd({ ...opts, __context: ctx });
  return res;
}