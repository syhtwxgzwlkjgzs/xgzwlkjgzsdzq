import {readEmoji} from '@discuzq/sdk/dist/api/other/read-emoji';
/**
 * 获取表情
 */
export default async function _readEmoji() {
  const res = await readEmoji({ url: '/apiv3/emoji' });
  return res;
}
