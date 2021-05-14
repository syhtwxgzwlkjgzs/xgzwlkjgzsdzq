import api from '../api';
export default async function readResetPayPwdToken(opts, ctx = null) {
  const res = await api.readResetPayPwdToken({ ...opts, __context: ctx });
  return res;
}
