import api from '../api';
export default async function updateUsersUpdate(opts, ctx) {
  const res = await api.updateUsersUpdate({ ...opts, __context: ctx });
  return res;
}
