import {readTopicsList} from '@discuzq/sdk/dist/api/content/read-topicslist';

/**
 * 获取话题列表
 */
export default async function _readTopics(opt = {}) {
  const res = await readTopicsList({ ...opt, url: '/apiv3/topics.list' });
  return res;
}