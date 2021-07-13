// import Taro from '@tarojs/taro';

let storage = null;

export default class Storage {
  constructor({ storageType }) {

    const isBrowser = typeof window !== 'undefined';
      if(storageType === "local") {
        storage = isBrowser ? window.localStorage : {};
      } else {
        storage = isBrowser ? window.sessionStorage : {};
      }

  }


  /**
   * 设置数据项
   * @param {string} key 键
   * @param {any} value 值
   */
  set(key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 得到数据项
   * @param {string} key 键
   */
  get(key) {
    try {
        return storage.getItem(key);
    } catch (error) {
      console.error(error);
    }
  }
}