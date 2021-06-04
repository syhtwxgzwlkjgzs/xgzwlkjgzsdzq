// import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';
import api from '../api';

/**
 * 把私信对话更新为已读
 * TODO: 待更新到sdk
 */
export default async function _updateDialog(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/dialog.update',
      method: 'POST',
      params,
      data,
      __context: ctx,
      ...others,
    };
    const result = await api.http(options);
    return result;
  } catch (error) {
    return error;
  }
}

