import api from '../api';
export default async function _getMiniCode(data) {
  data.path = `/pages/index/index?path=${encodeURIComponent(data.path)}`
  const res = await api.http({
    url: '/apiv3/oauth/wechat/miniprogram/code',
    method: 'GET',
    params: data,
    timeOut: 5000,
  });
  return res.data;
}
