// import {deleteDeny} from '@discuzq/sdk/dist/api/user/delete-deny';
/**
 * 发帖接口
 * TODO: 待更新到sdk
 */
export default async function _updateThread(params) {
  const res = await api.http({
    url: '/apiv3/thread.update',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
