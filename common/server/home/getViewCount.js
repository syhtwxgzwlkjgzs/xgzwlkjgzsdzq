// import { getViewCount } from '@discuzq/sdk/dist/api/home/update-view-count';
import api from '../api';

/** 描述：得到帖子浏览量，调用一次后端对该帖子浏览量加1
 * @param {object} params
 * @returns object
 */
export default async function _getViewCount(opts, ctx = null) {
  // const res = await getViewCount({ ...opts, __context: ctx });
  // return res;

  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/view.count', // 请求地址
      method: 'GET',
      params,
      data,
      ...others,
    };
    const result = await api.http(options);
    return result;
  } catch (error) {
    return handleError(error);
  }
}
