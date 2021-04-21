import api from './api';
export default async function setNickname(opts, ctx = null) {
  const res = await api.setNickname({ ...opts, __context: ctx });
  return res;
}
