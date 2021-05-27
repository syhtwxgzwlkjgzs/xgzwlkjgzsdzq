import {readUserLoginDisplay} from '@discuzq/sdk/dist/api/login/read-userlogindisplay';
export default async function _readUserLoginDisplay(opts, ctx = null) {
  const res = await readUserLoginDisplay({ ...opts, __context: ctx });
  return res;
}