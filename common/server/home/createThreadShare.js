import { createThreadShare } from '@discuzq/sdk/dist/api/home/create-thread-share';

export default async function _createThreadShare(opts, ctx = null) {
  const res = await createThreadShare({ ...opts, __context: ctx });
  return res;
}



// // import {createInviteLink} from '@discuzq/sdk/dist/api/invite/create-invite-link';
// import api from '../api';
// // export default async function share(opts, ctx = null) {
// //   // , url: '/apiv3/sticks'
// //   const res = await readStickList({ ...opts, __context: ctx, url: '/apiv3/thread.share' });
// //   return res;
// // }

// export default async function createThreadShare(opts, ctx = null) {
//   try {
//     const { params = {}, data = {}, ...others } = opts;
//     const options = {
//       url: '/apiv3/thread.share', // 请求地址
//       method: 'POST',
//       params,
//       data,
//       __context: ctx,
//       ...others,
//     };
//     const result = await api.http(options);
//     return result;
//   } catch (error) {
//     return error;
//   }
// }