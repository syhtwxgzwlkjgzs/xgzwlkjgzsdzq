import api from '../api';
export default async function miniQrcodeBind(opts, ctx) {
  const res = await api.miniQrcodeBind({ ...opts, __context: ctx });
  return res;
}
