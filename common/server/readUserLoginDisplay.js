import api from './api';
export default async function readUserLoginDisplay(opts, ctx = null) {
  const res = await api.readUserLoginDisplay({ ...opts, __context: ctx });
  return res;
}
