import { deleteThread } from '@discuzq/sdk/dist/api/thread/delete-thread';

export default async function _deleteThread(opts, ctx = null) {
  return await deleteThread({ ...opts, __context: ctx });
}
