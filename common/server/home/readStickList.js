import {readStickList} from '@discuzq/sdk/dist/api/content/read-sticklist';


export default async function _readStickList(opts, ctx = null) {
  const res = await readStickList({ ...opts, __context: ctx, url: '/apiv3/thread.stick' });
  return res;
}
