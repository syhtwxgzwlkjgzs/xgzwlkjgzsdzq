import api from '../api';
export default async function readCategories(opts, ctx) {
  const res = await api.readCategories({ ...opts, __context: ctx, url: '/apiv3/categories' });
  return res;
}
