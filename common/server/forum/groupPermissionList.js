import api from '../api';

/** 当前用户所拥有的权限
 * @param {object} params
 * @returns object
 */
export default async function groupPermissionList(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/group.permission.list', // 请求地址
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
