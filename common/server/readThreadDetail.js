import api from './api';

export default async function readThreadDetail(opts, ctx = null) {
  const res = await api.readThreadDetail({ ...opts, __context: ctx });
  return res;
}
