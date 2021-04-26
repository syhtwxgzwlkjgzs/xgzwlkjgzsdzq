import api from './api';
export default async function readPermissions(opts, ctx = null) {
  const res = await api.readPermissions({ ...opts, __context: ctx });
  return res;
}
