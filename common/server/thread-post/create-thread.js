import api from '../api';

/**
 * 发帖接口
 * TODO: 待更新到sdk
 */
export default async function createThread(params) {
  const res = await api.http({
    url: '/apiv3/thread.create',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}