import api from '../api';

/**
 * 获取粉丝关注
 */
export default async function readFollow(opt = {}) {
  const res = await api.readFollow({ ...opt, url: '/apiv3/follow' });
  return res;
}
