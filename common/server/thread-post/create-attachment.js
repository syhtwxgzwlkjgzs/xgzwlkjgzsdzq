import api from '../api';

/**
 * 附件、图片等上传接口 [先放到这里]
 * @param {FormData} params 请求参数
 * @param {File} params.file 要上传的文件
 * @param {number} params.type 要上传的类型，请看 @common/constants/thread-post.js 文件中的附件类型 ATTACHMENT_TYPE
 * @param {number} params.order 排序情况【不必须】
 * @returns 上传之后的结果
 * @example
 * const formData = new FormData();
 * formData.append('file', file);
 * formData.append('type', 1);
 * const ret = await createAttachment(formData); // 在 async 方法中
 */
export default async function createAttachment(params, progress) {
  const res = await api.http({
    url: '/apiv3/attachments',
    method: 'post',
    transformRequest: [function (data) {
      return data;
    }],
    onUploadProgress: (progressEvent) => {
      progress(progressEvent);
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: params,
  });
  return res;
}
