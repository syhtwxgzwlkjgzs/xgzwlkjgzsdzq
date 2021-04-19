import api from '../api';

/**
 * 获取话题列表
 */
export default async function readTopics(opt = {}) {
  const res = await api.readTopicsList({ ...opt, url: '/apiv3/topics.list' });
  return res;
}
