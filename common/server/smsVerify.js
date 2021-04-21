import api from './api';

export default async function smsVerify(opts, ctx = null) {
  const res = await api.smsVerify({ ...opts, __context: ctx });
  return res;
}
