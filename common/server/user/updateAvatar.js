import api from '../api';

export default async function updateAvatar(opts, ctx) {
  const res = await api.updateAvatar({ ...opts, __context: ctx });
  return res;
}
