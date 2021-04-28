import api from '../api';
export default async function updatePayPwd(opts, ctx = null) {
  const res = await api.updatePayPwd({ ...opts, __context: ctx });
  return res;
}
