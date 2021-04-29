import api from './api';
export default async function miniBind(opts, ctx) {
  const res = await api.miniBind({ ...opts, __context: ctx });
  return res;
}
