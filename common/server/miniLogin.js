import api from './api';
export default async function miniLogin(opts, ctx) {
  const res = await api.miniLogin({ ...opts, __context: ctx });
  return res;
}
