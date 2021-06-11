import api from '../api';
export default async function _getMiniCode(data) {
  const res = await api.http({
    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
    method: 'post',
    data,
    timeOut: 5000,
  });
  return res;
}
