import api from './api';
export default async function usernameAutoBind(opts, ctx) {
  console.log(api.usernameAutoBind);
  const res = await api.usernameAutoBind({ ...opts, __context: ctx });
  return res;
}
