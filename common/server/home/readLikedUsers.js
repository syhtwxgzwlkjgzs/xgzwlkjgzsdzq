import api from '../api';

/** 获取点赞、打赏用户列表
 * @param {object} params
 * @returns object
 */
export default async function readLikedUsers(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/thread.likedusers', // 请求地址
      method: 'GET',
      params,
      data,
      __context: ctx,
      ...others,
    };
    const result = await api.http(options);
    return result;
  } catch (error) {
    return error;
  }
}
