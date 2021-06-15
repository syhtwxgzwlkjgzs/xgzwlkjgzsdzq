import api from '../api';
export default async function _getMiniCode(data) {
  const res = await api.http({
    url: '',
    method: 'post',
    data,
    timeOut: 5000,
  });
  return res;
}
