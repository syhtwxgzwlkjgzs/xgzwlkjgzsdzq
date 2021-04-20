import { readTopicsList, readUsersList, readThreadList } from '../../server';
/**
   * 发现模块 - 首页数据
   * @param {object} filter * 过滤参数
   * @returns {object} 处理结果
   */
export const getSearchData = async () => {
  const promise1 = readTopicsList({ filter: { hot: 1 } });
  const promise2 = readUsersList({});
  const promise3 = readThreadList({ filter: { sequence: '1', filter: { sort: '3' } } });
  const promise = [promise1, promise2, promise3];
  let res = await Promise.allSettled(promise);

  res = res.map((item) => {
    const { value } = item;
    const { code, data } = value;
    return code === 0 ? data : {};
  });

  return {
    res,
  };
};
