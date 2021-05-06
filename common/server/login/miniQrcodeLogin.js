import api from '../api';
export default async function miniQrcodeLogin(opts, ctx) {
  const res = await api.miniQrcodeLogin({ ...opts, __context: ctx });
  return res;
}
