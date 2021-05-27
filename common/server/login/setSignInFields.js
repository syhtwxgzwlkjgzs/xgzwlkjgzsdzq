import api from '../api';
export default async function setSignInFields(opts, ctx) {
  return await api.setSignInFields({ ...opts, __context: ctx });
}
