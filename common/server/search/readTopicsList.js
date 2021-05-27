import {readTopicsList} from '@discuzq/sdk/dist/api/content/read-topicslist';


/**
 * 潮流话题
 */
export default async function _readTopics(opt = {}, ctx = null) {
  const res = await readTopicsList({ ...opt, __context: ctx, url: '/apiv3/topics.list' });
  return res;
}