import api from '../api';
export default async function readWalletCash(opts, ctx = null) {
  const res = await api.readWalletCash({ ...opts, __context: ctx });
  return res;
}
