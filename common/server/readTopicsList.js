import api from './api';
// 潮流话题
export default async function readTopicsList(opts, ctx = null) {
  const res = await api.readTopicsList({ ...opts, __context: ctx });
  return res;
}
