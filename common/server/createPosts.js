import api from './api';

export default async function createPosts(opts, ctx = null) {
  const res = await api.createPosts({ ...opts, __context: ctx });
  return res;
}
