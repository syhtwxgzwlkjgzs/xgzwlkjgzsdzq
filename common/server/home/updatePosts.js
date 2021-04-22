import api from '../api';

/**
 * 点赞
 */
export default async function updatePosts(opt = {}, ctx = null) {
  const res = await api.updatePosts({ ...opt, __context: ctx, url: '/apiv3/posts.update', isValidate: false });

  return res;
}
