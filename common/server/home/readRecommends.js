// import {readCategories} from '@discuzq/sdk/dist/api/content/read-categories';

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
      const result = await http(options);
      return result;
    } catch (error) {
      return error;
    }
  }