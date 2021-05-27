import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';

/**
 * 获取私信对话列表
 * TODO: 待更新到sdk
 */
export default async function _readDialogList(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/dialog',
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

