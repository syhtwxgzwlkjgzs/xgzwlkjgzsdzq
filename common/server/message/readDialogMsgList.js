/**
 * 获取具体对话的私信内容列表
 */
import { readDialogMessageList } from '@discuzq/sdk/dist/api/notice/read-dialog-message-list';

export default async function _readDialogMsgList(opts, ctx = null) {
  const res = await readDialogMessageList({ ...opts, __context: ctx });
  return res;
}
