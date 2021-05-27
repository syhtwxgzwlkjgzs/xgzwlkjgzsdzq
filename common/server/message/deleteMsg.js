// import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';

/**
 * 删除消息
 * TODO: 待更新到sdk
 */
export default async function _deleteMsg(params) {
  const res = await http({
    url: 'apiv3/notification.delete',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
