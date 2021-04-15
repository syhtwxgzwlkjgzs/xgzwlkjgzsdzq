import api from '../api';

/**
 * 获取商品信息
 */
export default async function readProcutAnalysis(opt = {}) {
  const res = await api.readGoodsAnalysis(opt);
  return res;
}
