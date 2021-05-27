// import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';

/**
 * 创建新的私信对话
 * TODO: 待更新到sdk
 */
export default async function _createDialog(params) {
  const res = await http({
    url: '/apiv3/dialog.create',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
