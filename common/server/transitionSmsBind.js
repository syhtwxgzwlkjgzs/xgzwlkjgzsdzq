import api from './api';

export default async function transitionSmsBind(opts, ctx = null) {
  const res = await api.transitionSmsBind({ ...opts, __context: ctx });
  return res;
}
