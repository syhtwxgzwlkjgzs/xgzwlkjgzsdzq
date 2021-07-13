// import api from '../api';
// export default async function _getMiniCode(params) {
//   params.path = `/pages/index/index?path=${encodeURIComponent(params.path)}`;
//   const res = await api.http({
//     url: '/apiv3/oauth/wechat/miniprogram/code',
//     method: 'GET',
//     params: params,
//     timeOut: 5000,
//   });
//   return res.data;
// }



import { getMiniCode } from '@discuzq/sdk/dist/api/home/get-mini-code';

/** 得到二维码用于分享
 * @param {object} params
 * @returns object
 */
export default async function _getMiniCode(opts, ctx = null) {
  const res = await getMiniCode({ ...opts, __context: ctx });
  return res;
}