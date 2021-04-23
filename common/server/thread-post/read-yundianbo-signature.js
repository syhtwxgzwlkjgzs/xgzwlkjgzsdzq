import api from '../api';

/**
 * 云点播前端上传签名
 * TODO: 待更新到sdk
 */
export default async function readYundianboSignature(params = {}) {
  const res = await api.http({
    url: 'apiv3/signature',
    method: 'get',
    data: params,
    timeout: 5000,
  });
  return res;
}
