// import {deleteDeny} from '@discuzq/sdk/dist/api/user/delete-deny';
import api from '../api';

export default async function _readThreadDetail(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/thread.detail', // 请求地址
      method: 'GET',
      params,
      data,
      __context: ctx,
      ...others,
    };
    const result = await api.http(options);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}
