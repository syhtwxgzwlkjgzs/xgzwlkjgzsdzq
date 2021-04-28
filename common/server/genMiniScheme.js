import api from './api';
export default async function genMiniScheme(opts, ctx = null) {
  const res = await api.genMiniScheme({ ...opts, __context: ctx });
  return res;
}
