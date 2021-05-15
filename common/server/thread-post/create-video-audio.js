import api from '../api';

/**
 * 创建视频音频接口
 * @param {object} params 请求参数
 * @param {string} params.fileId 要上传的文件
 * @param {number} params.type 要上传的类型，[不必须】视频：0，音频：1
 * @param {string} params.fileName 排序情况【不必须】
 * TODO: 待更新到sdk
 */
export default async function createThreadVideoAudio(params) {
  const res = await api.http({
    url: '/apiv3/thread/video',
    method: 'post',
    data: params,
  });
  return res;
}
