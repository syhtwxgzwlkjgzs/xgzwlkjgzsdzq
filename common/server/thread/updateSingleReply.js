import { updateSingleReply } from '@discuzq/sdk/dist/api/thread/update-singlereply';

export default async function _updateSingleReply(opts, ctx = null) {
  return await updateSingleReply({ ...opts, __context: ctx });
}
