import api from '../api';

/**
 * 潮流话题
 */
export default async function readTopics(opt = {}, ctx = null) {
  const res = await api.readTopicsList({ ...opt, __context: ctx, url: '/apiv3/topics.list' });
  return res;
}
