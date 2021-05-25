import api from '../api';

export default async function readUsersDeny(opts, ctx) {
  const res = await api.readUsersDeny({ ...opts, __context: ctx });
  return res;
}
