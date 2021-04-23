import { action } from 'mobx';
import SearchStore from './store';
import { readTopicsList, readUsersList, readThreadList } from '../../server';

class SearchAction extends SearchStore {
  constructor(props) {
    super(props);
  }

  @action
  setIndexTopics(data) {
    this.indexTopics = data;
  }

  @action
  setIndexUsers(data) {
    this.indexUsers = data;
  }

  @action
  setIndexThreads(data) {
    this.indexThreads = data;
  }

  @action
  setTopics(data) {
    this.topics = data;
  }

  @action
  setUsers(data) {
    this.users = data;
  }

  @action
  setThreads(data) {
    this.threads = data;
  }

  @action
  setSearchTopics(data) {
    this.searchTopics = data;
  }

  @action
  setSearchUsers(data) {
    this.searchUsers = data;
  }

  @action
  setSearchThreads(data) {
    this.searchThreads = data;
  }

  /**
   * 发现模块 - 首页数据
   * @param {object} search * 搜索值
   * @param {number} type * 0: 发现页发起请求 1：发现搜索结果页发起请求
   * @returns {object} 处理结果
   */
  @action
  async getSearchData({ type = 0, search, perPage = 10 } = {}) {
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

    if (type === 0) {
      this.setIndexTopics(res[0]);
      this.setIndexUsers(res[1]);
      this.setIndexThreads(res[2]);
    } else if (type === 1) {
      this.setSearchTopics(res[0]);
      this.setSearchUsers(res[1]);
      this.setSearchThreads(res[2]);
    }

    return {
      res,
    };
  };

  /**
   * 发现模块 - 更多话题
   * @param {object} search * 搜索值
   * @returns {object} 处理结果
   */
  @action
  async getTopicsList({ search = '', perPage = 10, page = 1 } = {}) {
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
  @action
  async getUsersList({ search = '', perPage = 10, page = 1  } = {}) {
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
 @action
  async getThreadList({ search = '', perPage = 10, page = 1 } = {}) {
    const threads = await readThreadList({ params: { filter: { sequence: '0', filter: { sort: '3', search } }, perPage, page } });

    const res = threads?.data || {};

    if (page === 1) {
      this.setThreads(res);
    } else {
      if (res?.pageData?.length) {
        this.page += 1;
        res.pageData.unshift(...(this.topics?.pageData || []));
        this.setThreads(res);
      }
    }

    return {
      res,
    };
  };
}

export default SearchAction;
