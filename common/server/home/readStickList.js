import api from '../api';

export default async function readStickList(opts, ctx = null) {
  const res = await api.readStickList({ ...opts, __context: ctx, url: '/apiv3/thread.stick' });
  return res;
}
