import { readThreadList } from '@discuzq/sdk/dist/api/home/read-thread-list';

/** 首页列表/热门内容
 * @param {object} params
 * @returns object
 */
export default async function _readThreadList(opts, ctx = null) {
  const res = await readThreadList({ ...opts, __context: ctx, isValidate: false });
  return res;
}
