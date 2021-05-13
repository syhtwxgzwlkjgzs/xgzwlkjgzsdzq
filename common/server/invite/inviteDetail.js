import api from '../api';
/** 邀请详情
 * @param {object} params
 * @returns object
 */
export default async function inviteDetail(opts, ctx = null) {
  return await api.inviteDetail({ ...opts, __context: ctx });
}
