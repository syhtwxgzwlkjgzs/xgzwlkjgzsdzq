import api from './api';
export default async function smsSend(opts, ctx) {
  const res = await api.smsSend({ ...opts, __context: ctx });
  return res;
}
