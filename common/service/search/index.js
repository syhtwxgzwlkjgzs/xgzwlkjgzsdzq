import { readTopicsList, readUsersList, readThreadList } from '../../server';
/**
   * 发现模块 - 首页数据
   * @param {object} search * 搜索值
   * @returns {object} 处理结果
   */
export const getSearchData = async ({ search } = {}) => {
  let perPage = 10;
  const topicFilter = {
    hot: search !== '' ? 0 : 1,
    content: search,
  };

  // 如果存在search字段，说明是在结果页发起的网络请求，此时只需要后台返回三条数据
  if (search || search === '') {
    perPage = 3;
  }
  const promise1 = readTopicsList({ params: { filter: topicFilter, perPage, page: 1 } });
  const promise2 = readUsersList({ params: { filter: { username: search }, perPage, page: 1 } });
  const promise3 = readThreadList({ params: { filter: { filter: { sort: '3', search } }, perPage } });
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

/**
 * 发现模块 - 更多话题
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
export const getTopicsList = async ({ search = '', perPage = 10, page = 1 } = {}) => {
  const topicFilter = {
    hot: 0,
    content: search,
  };
  const topics = await readTopicsList({ params: { filter: topicFilter, perPage, page } });

  return {
    res: topics.data || {},
  };
};

/**
 * 发现模块 - 更多用户
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
export const getUsersList = async ({ search = '', perPage = 10, page = 1  } = {}) => {
  const users = await readUsersList({ params: { filter: { username: search }, perPage, page } });
  return {
    res: users.data || {},
  };
};

/**
 * 发现模块 - 更多内容
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
export const getThreadList = async ({ search = '', perPage = 10, page = 1 } = {}) => {
  const threads = await readThreadList({ params: { filter: { sequence: '1', filter: { sort: '3', search } }, perPage, page } });

  return {
    res: threads.data || {},
  };
};
