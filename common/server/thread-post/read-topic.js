import api from '../api';

/**
 * 获取话题列表
 */
export default async function readTopics() {
  const res = await api.readTopicsList();
  return res;
}
