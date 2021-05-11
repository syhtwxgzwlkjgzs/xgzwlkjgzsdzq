import api from '../api';

/**
 * 首页列表
 */
export default async function readThreadList(opt = {}, ctx = null) {
  const res = await api.readThreadList({ ...opt, __context: ctx, url: '/apiv3/thread.list', isValidate: false });
  return res;
}
