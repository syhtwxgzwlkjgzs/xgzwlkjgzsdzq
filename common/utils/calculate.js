/**
 * 处理js计算精读的问题
 */

export const plus = (num1, num2) => {
  if (isNaN(num1) || isNaN(num2)) return 0;

  let p1 = 0;
  let p2 = 0;

  if (num1.toString().split('.').length > 1) {
    p1 = num1.toString().split('.')[1].length;
  }

  if (num2.toString().split('.').length > 1) {
    p2 = num2.toString().split('.')[1].length;
  }

  const p = p1 > p2 ? p1 : p2;

  const n1 = num1 * Math.pow(10, p);
  const n2 = num2 * Math.pow(10, p);

  const result = (n1 + n2) / Math.pow(10, p);

  return result.toFixed(2);
};

export const minus = (num1, num2) => {
  if (isNaN(num1) || isNaN(num2)) return 0;

  let p1 = 0;
  let p2 = 0;

  if (num1.toString().split('.').length > 1) {
    p1 = num1.toString().split('.')[1].length;
  }

  if (num2.toString().split('.').length > 1) {
    p2 = num2.toString().split('.')[1].length;
  }

  const p = p1 > p2 ? p1 : p2;

  const n1 = num1 * Math.pow(10, p);
  const n2 = num2 * Math.pow(10, p);

  const result = (n1 - n2) / Math.pow(10, p);

  return result;
};
