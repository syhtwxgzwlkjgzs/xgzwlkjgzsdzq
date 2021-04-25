import api from '../api';
export default async function readOrderDetail(opts, ctx = null) {
  const res = await api.readOrderDetail({ ...opts, __context: ctx });
  return res;
}
