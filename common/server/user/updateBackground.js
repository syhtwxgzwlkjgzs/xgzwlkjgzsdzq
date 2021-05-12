import api from '../api';

export default async function updateBackground(opts, ctx) {
  const res = await api.updateBackground({ ...opts, __context: ctx });
  return res;
}
