import api from '../api';

/**
 * 获取私信对话的消息列表
 * TODO: 待更新到sdk
 */
export default async function readDialogMsgList(opts, ctx = null) {
  try {
    const { params = {}, data = {}, ...others } = opts;
    const options = {
      url: 'apiv3/dialog/message',
      method: 'GET',
      params,
      data,
      __context: ctx,
      ...others,
    };
    const result = await api.http(options);
    return result;
  } catch (error) {
    return error;
  }
}

