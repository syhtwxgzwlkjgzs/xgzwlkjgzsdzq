import api from '../api';

/**
 * 活跃用户
 */
export default async function readUsersList(opt = {}, ctx = null) {
  // const res = await api.readUsersList({ ...opt, __context: ctx, url: '/apiv3/users.list' });
  const res = await api.http({
    url: '/apiv3/users.list',
    method: 'get',
    transformRequest: [function (data) {
      return data;
    }],
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: opt,
  });
  return res;
}
