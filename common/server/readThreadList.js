import api from './api';

/**
 * 首页列表
 */
export default async function readThreadList(opt = {}, ctx = null) {
  // const res = await api.readThreadList({ ...opt, __context: ctx, url: '/apiv3/thread.list' });
  const res = await api.http({
    url: '/apiv3/thread.list',
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
