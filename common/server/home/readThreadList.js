import {readThreadList} from '@discuzq/sdk/dist/api/content/read-threadlist';

/**
 * 首页列表
 */
export default async function _readThreadList(opt = {}, ctx = null) {
  const res = await readThreadList({ ...opt, __context: ctx, url: '/apiv3/thread.list', isValidate: false });
  return res;
}
