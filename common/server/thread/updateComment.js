import { updateComment } from '@discuzq/sdk/dist/api/thread/update-comment';

export default async function _updateComment(opts, ctx = null) {
  return await updateComment({ ...opts, __context: ctx });
}
