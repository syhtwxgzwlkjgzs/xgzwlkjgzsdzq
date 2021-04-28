import api from '../api';
export default async function createPayOrder(opts, ctx = null) {
  const res = await api.createPayOrder({ ...opts, __context: ctx });
  return res;
}
