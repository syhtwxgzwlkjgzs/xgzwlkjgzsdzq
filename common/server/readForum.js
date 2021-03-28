import api from './api';
export default async function readForum(opts, ctx = null) {
  const res = await api.readForum({ ...opts, __context: ctx });
  return res;
}
