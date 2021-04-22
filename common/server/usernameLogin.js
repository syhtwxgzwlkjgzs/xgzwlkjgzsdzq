import api from './api';

export default async function usernameLogin(opts, ctx = null) {
  const res = await api.usernameLogin({ ...opts, __context: ctx });
  return res;
}
