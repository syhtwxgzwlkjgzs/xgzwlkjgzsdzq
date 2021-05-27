// import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';

/**
 * 获取未读消息数量
 * TODO: 待更新到sdk
 */
export default async function _readUnreadCount(opts = {}, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: 'apiv3/unreadnotification',
      method: 'GET',
      params,
      data,
      __context: ctx,
      ...others,
    };
    const result = await http(options);
    return result;
  } catch (error) {
    return error;
  }
}
