import isServer from '@common/utils/is-server';
/**
 * 获取当前平台
 * @param {string} ua 当前 UserAgent
 */
export default function getPlatform(ua) {
  let platform = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ? 'h5' : 'pc';
  if (!isServer()) {
      const currentWidth = window.innerWidth;
      if ( platform === 'pc' && currentWidth < 800 ) {
        platform = 'h5';
      }

      if (  platform === 'h5' && currentWidth >= 800 ) {
        platform = 'pc';
      }
  }
  return platform
}
