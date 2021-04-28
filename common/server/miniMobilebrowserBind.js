import api from './api';
export default async function miniMobilebrowserBind(opts, ctx) {
  const res = await api.miniMobilebrowserBind({ ...opts, __context: ctx });
  return res;
}
