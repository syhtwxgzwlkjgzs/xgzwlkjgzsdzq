import api from './api';
export default async function smsBind(opts, ctx) {
  const res = await api.smsBind({ ...opts, __context: ctx });
  return res;
}
