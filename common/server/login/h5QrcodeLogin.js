import api from '../api';
export default async function h5QrcodeLogin(opts, ctx) {
  const res = await api.h5QrcodeLogin({ ...opts, __context: ctx });
  return res;
}
