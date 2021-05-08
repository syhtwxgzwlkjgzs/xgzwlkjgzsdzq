/**
 * 设定数据
 * @param target 目标
 * @param path 路径
 * @param value 目标值
 * ```js
 * let obj = {};
 * set(obj, 'a.b.c', 1);
 * // obj.a.b.c -> 1
 * ```
 */
const set = (target, path, value) => {
  const travel = regexp => String.prototype.split
    .call(path, regexp)
    .filter(Boolean)
    .reduce((res, key, index, arr) => {
      if (res === null || res === undefined) {
        res = {};
      }
      if (arr.length === index + 1) {
        res[key] = value;
      } else {
        res[key] = {};
      }
      return res[key];
    }, target);
  const result = travel(/[,[\].]+?/);
  return Boolean(result);
};

export default set;

