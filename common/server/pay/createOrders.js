import api from '../api';
export default async function createOrders(opts, ctx = null) {
  const res = await api.createOrdersCreate({ ...opts, __context: ctx });
  return res;
}
