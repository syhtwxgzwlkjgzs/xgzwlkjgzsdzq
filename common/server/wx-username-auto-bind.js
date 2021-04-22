import api from './api';
export default async function usernameAutoBind(opts, ctx) {
  const res = await api.usernameAutoBind({ ...opts, __context: ctx });
  return res;
}
