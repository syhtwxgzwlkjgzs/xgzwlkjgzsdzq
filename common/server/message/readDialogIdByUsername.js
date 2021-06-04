// import {createOrdersCreate} from '@discuzq/sdk/dist/api/pay/create-orderscreate';
import api from '../api';

/**
 * 根据username获取到dialogid
 * TODO: 待更新到sdk
 */
export default async function _readDialogIdByUsername(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/dialog.record',
      method: 'GET',
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

