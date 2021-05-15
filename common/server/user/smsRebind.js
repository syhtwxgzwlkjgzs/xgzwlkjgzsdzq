import api from '../api';

export default async function smsRebind(opts, ctx) {
  const res = await api.smsRebind({ ...opts, __context: ctx });
  return res;
}
