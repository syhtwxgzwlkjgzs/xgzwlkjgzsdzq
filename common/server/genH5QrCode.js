import api from './api';
export default async function genH5Qrcode(opts, ctx) {
  const res = await api.genH5Qrcode({ ...opts, __context: ctx });
  return res;
}
