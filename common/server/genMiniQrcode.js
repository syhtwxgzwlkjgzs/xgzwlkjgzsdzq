import api from './api';
export default async function genMiniQrcode(opts, ctx) {
  const res = await api.genMiniQrcode({ ...opts, __context: ctx });
  return res;
}
