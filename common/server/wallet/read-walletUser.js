import api from '../api';
export default async function readWalletUser(opts, ctx = null) {
  const res = await api.readWalletUser({ ...opts, __context: ctx });
  return res;
}
