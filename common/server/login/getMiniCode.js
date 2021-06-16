import api from '../api';
export default async function _getMiniCode(data) {
  const res = await api.http({
    url: '/apiv3/oauth/wechat/miniprogram/code',
    method: 'GET',
    params: data,
    timeOut: 5000,
  });
  return res.data;
}
