// import {deleteDeny} from '@discuzq/sdk/dist/api/user/delete-deny';

export default async function _updateComment(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/posts.update', // 请求地址
      method: 'POST',
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
