import api from '../api';
/** 邀请用户列表
 * @param {object} params
 * @returns object
 */
export default async function inviteUsersList(opts, ctx = null) {
  return await api.inviteUsersList({ ...opts, __context: ctx });
}
