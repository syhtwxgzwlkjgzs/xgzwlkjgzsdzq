import api from '../api';

/**
 * 活跃用户
 */
export default async function readUsersList(opt = {}, ctx = null) {
  const res = await api.readUsersList({ ...opt, __context: ctx, url: '/apiv3/users.list', isValidate: false });

  return res;
}
