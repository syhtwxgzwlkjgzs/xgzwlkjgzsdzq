/**
 * 节流函数
 *
 * @param {function} fn 节流回调函数
 * @param {number} delay 节流时间
 */
const throttle = function (fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export default throttle;
