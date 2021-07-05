import { readCategories } from '@discuzq/sdk/dist/api/home/create-thread-share';

/** 创建帖子分享
 * @param {object} params
 * @returns object
 */
export default async function _readCategories(opts, ctx = null) {
  const res = await readCategories({ ...opts, __context: ctx });
  return res;
}