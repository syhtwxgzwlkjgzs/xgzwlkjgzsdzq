import api from '../api';
export default async function readWalletLog(opts, ctx = null) {
  const res = await api.readWalletLog({ ...opts, __context: ctx });
  return res;
}
