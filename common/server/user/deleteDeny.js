import api from '../api';

export default async function deleteDeny(opts, ctx) {
  const res = await api.deleteDeny({ ...opts, __context: ctx });
  return res;
}
