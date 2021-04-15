import api from '../api';

/**
 * 获取粉丝关注
 */
export default async function readProcutAnalysis(opt = {}) {
  const res = await api.readGoodsAnalysis(opt);
  return res;
}
