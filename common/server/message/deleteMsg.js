import api from '../api';

/**
 * 删除消息
 * TODO: 待更新到sdk
 */
export default async function deleteMsg(params) {
  const res = await api.http({
    url: 'apiv3/notification.delete',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
