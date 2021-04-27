import Taro from '@tarojs/taro';

export const toFixed = (number = 0) => 0.01 * Math.floor(100 * number);

// 随机数，获取当前canvas id
export const randomStr = (len = 16) => {
  const string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l = string.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    const index = Math.floor((Math.random() * 100 * l) % l);
    str += string[index];
  }
  return str;
};

export const getElementRect = async (eleId = '', delay = 200) => new Promise((resovle, reject) => {
  const t = setTimeout(() => {
    clearTimeout(t);

    Taro.createSelectorQuery()
      .select(`#${eleId}`)
      .boundingClientRect((rect) => {
        delay
        if (rect) {
          resovle(rect);
        } else {
          reject('获取不到元素');
        }
      })
      .exec();
  }, delay);
});
