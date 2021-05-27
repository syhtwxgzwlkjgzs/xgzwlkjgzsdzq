// import {deleteDeny} from '@discuzq/sdk/dist/api/user/delete-deny';

export default async function _readCommentDetail(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/posts.detail', // 请求地址
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
