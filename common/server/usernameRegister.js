import api from './api';

export default async function usernameRegister(opts, ctx = null) {
  const res = await api.usernameRegister({ ...opts, __context: ctx });
  return res;
}
