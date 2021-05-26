import api from '../api';
export default async function getSignInFields(opts, ctx) {
  return await api.getSignInFields({ ...opts, __context: ctx });
}
