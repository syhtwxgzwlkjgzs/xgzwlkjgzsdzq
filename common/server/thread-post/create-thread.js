import api from '../api';

/**
 * 发帖接口
 * TODO: 待更新到sdk
 */
export default async function _createThread(params) {
  const res = await http({
    url: '/apiv3/thread.create',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
