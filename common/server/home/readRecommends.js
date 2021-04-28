import api from '../api';

export default async function readRecommends(opts, ctx = null) {
    try {
      const { params = {}, data = {}, ...others } = opts;
      const options = {
        url: '/apiv3/thread.recommends', // 请求地址
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