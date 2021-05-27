import {readUsersList} from '@discuzq/sdk/dist/api/user/read-userslist';

/**
 * 活跃用户
 */
export default async function _readUsersList(opt = {}, ctx = null) {
  const res = await readUsersList({ ...opt, __context: ctx, url: '/apiv3/users.list', isValidate: false });

  return res;
}