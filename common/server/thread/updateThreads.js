import api from '../api';

export default async function updateThreads(opts, ctx = null) {
  const res = await api.updateThreads({ ...opts, __context: ctx, url: '/apiv3/thread.update' });
  return res;
}
