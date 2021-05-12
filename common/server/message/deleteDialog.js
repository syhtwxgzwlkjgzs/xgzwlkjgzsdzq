import api from '../api';

/**
 * 删除私信对话
 * TODO: 待更新到sdk
 */
export default async function deleteDialog(params) {
  const res = await api.http({
    url: 'apiv3/dialog.delete',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
