import api from '../api';
export default async function h5QrcodeBind(opts, ctx) {
  const res = await api.h5QrcodeBind({ ...opts, __context: ctx });
  return res;
}
