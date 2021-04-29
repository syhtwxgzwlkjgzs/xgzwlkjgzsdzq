import { action } from 'mobx';
import SearchStore from './store';
import { readTopicsList, readUsersList, readThreadList, createFollow } from '../../server';

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
  async getSearchData({
    type = 0,
    search,
    perPage = 10,
    hasTopics = false,
    hasUsers = false,
    hasThreads = false,
  } = {}) {
    let newPerPage = perPage;
    const topicFilter = {
      hot: search !== '' ? 0 : 1,
      content: search,
    };

    // 如果存在search字段，说明是在结果页发起的网络请求，此时只需要后台返回三条数据
    if (type === 1) {
      newPerPage = 3;
    }

    const promise1 = !hasTopics
      ? readTopicsList({ params: { filter: topicFilter, perPage: newPerPage, page: 1 } })
      : {};
    const promise2 = !hasUsers
      ? readUsersList({ params: { filter: { username: search }, perPage: newPerPage, page: 1 } })
      : {};
    const promise3 = !hasThreads
      ? readThreadList({ params: { filter: { filter: { sort: '3', search } }, perPage: newPerPage, page: 1 } })
      : {};
    const promise = [promise1, promise2, promise3];

    let res = await Promise.allSettled(promise);

    res = res.map((item) => {
      const { value } = item;
      const { code, data } = value;
      return code === 0 ? data : {};
    });

    if (type === 0) {
      !hasTopics && this.setIndexTopics(res[0]);
      !hasUsers && this.setIndexUsers(res[1]);
      !hasThreads && this.setIndexThreads(res[2]);
    } else if (type === 1) {
      !hasTopics && this.setSearchTopics(res[0]);
      !hasUsers && this.setSearchUsers(res[1]);
      !hasThreads && this.setSearchThreads(res[2]);
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
    const result = await readTopicsList({ params: { filter: topicFilter, perPage, page } });

    if (result.code === 0 && result.data) {
      if (this.topics && result.data.pageData && page !== 1) {
        this.topics.pageData.push(...result.data.pageData);
        const newPageData = this.topics.pageData.slice();
        this.setTopics({ ...result.data, pageData: newPageData });
      } else {
        // 首次加载，先置空，是为了列表回到顶部
        this.setTopics({ pageData: [] });
        this.setTopics(result.data);
      }
      return result.data;
    }
    return null;
  };

  /**
   * 发现模块 - 更多用户
   * @param {object} search * 搜索值
   * @returns {object} 处理结果
   */
  @action
  async getUsersList({ search = '', perPage = 10, page = 1  } = {}) {
    const result = await readUsersList({ params: { filter: { username: search }, perPage, page } });

    if (result.code === 0 && result.data) {
      if (this.users && result.data.pageData && page !== 1) {
        this.users.pageData.push(...result.data.pageData);
        const newPageData = this.users.pageData.slice();
        this.setUsers({ ...result.data, pageData: newPageData });
      } else {
        // 首次加载，先置空，是为了列表回到顶部
        this.setUsers({ pageData: [] });
        this.setUsers(result.data);
      }
      return result.data;
    }
    return null;
  };

  /**
 * 发现模块 - 更多内容
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
 @action
  async getThreadList({ search = '', perPage = 10, page = 1 } = {}) {
    const result = await readThreadList({ params: { filter: { sequence: '0', filter: { sort: '3', search } }, perPage, page } });

    if (result.code === 0 && result.data) {
      if (this.threads && result.data.pageData && page !== 1) {
        this.threads.pageData.push(...result.data.pageData);
        const newPageData = this.threads.pageData.slice();
        this.setThreads({ ...result.data, pageData: newPageData });
      } else {
        // 首次加载，先置空，是为了列表回到顶部
        this.setThreads({ pageData: [] });
        this.setThreads(result.data);
      }
      return result.data;
    }
    return null;
  };

/**
 * 发现模块 - 关注
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
 @action
 async postFollow(userId) {
   const result = await createFollow({ data: { data: { toUserId: userId } } });

   if (result.code === 0 && result.data) {
     
     return result.data;
   }
   return null;
 };
}

export default SearchAction;
