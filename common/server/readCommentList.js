import api from './api';

export default async function readCommentList(opts, ctx = null) {
  const res = await api.readCommentList({ ...opts, __context: ctx });
  return res;
}
