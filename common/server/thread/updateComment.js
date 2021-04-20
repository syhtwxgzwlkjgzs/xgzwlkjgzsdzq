import api from '../api';

export default async function updateComment(opts, ctx = null) {
  const res = await api.updateComment({ ...opts, __context: ctx });
  return res;
}
