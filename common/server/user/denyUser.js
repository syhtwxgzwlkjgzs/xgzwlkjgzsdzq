import api from '../api';

export default async function denyUser(opts, ctx) {
  const res = await api.updateDeny({ ...opts, __context: ctx });
  return res;
}
