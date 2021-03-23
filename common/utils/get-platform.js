/**
 * 获取当前平台
 * @param {string} ua 当前 UserAgent
 */
export default function getPlatform(ua) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ? 'h5' : 'pc';
}
