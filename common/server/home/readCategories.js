import {readCategories} from '@discuzq/sdk/dist/api/content/read-categories';
export default async function _readCategories(opts, ctx) {
  const res = await readCategories({ ...opts, __context: ctx, url: '/apiv3/categories' });
  return res;
}