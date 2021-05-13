import api from '../api';
/** 创建邀请链接
 * @param {object} params
 * @returns object
 */
export default async function createInviteLink(opts, ctx = null) {
  return await api.createInviteLink({ ...opts, __context: ctx });
}
