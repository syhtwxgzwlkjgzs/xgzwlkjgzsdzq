import api from '../api';

// TODO: 后端还未提供该接口
export default async function readReplyList(opts, ctx = null) {
  const res = await api.readReplyList({ ...opts, __context: ctx });
  return res;
}
