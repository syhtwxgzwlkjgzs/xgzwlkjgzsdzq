
// import {createInviteLink} from '@discuzq/sdk/dist/api/invite/create-invite-link';

// export default async function share(opts, ctx = null) {
//   // , url: '/apiv3/sticks'
//   const res = await readStickList({ ...opts, __context: ctx, url: '/apiv3/thread.share' });
//   return res;
// }

export default async function createThreadShare(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: '/apiv3/thread.share', // 请求地址
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
