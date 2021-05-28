import {updatePosts} from '@discuzq/sdk/dist/api/content/update-posts';


/**
 * 点赞
 */
export default async function _updatePosts(opt = {}, ctx = null) {
  const res = await updatePosts({ ...opt, __context: ctx, url: '/apiv3/posts.update', isValidate: false });

  return res;
}
