// import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';
import api from '../api';

/**
 * 私信发送消息
 * TODO: 待更新到sdk
 */
export default async function _createDialogMsg(params) {
  const res = await api.http({
    url: 'apiv3/dialog/message.create',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}
