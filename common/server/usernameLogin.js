import {usernameLogin} from '@discuzq/sdk/dist/api/login/wx-username-auto-bind'
export default async function _usernameLogin(opts, ctx = null) {
  const res = await usernameLogin({ ...opts, __context: ctx });
  return res;
}
