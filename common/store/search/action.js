import { action } from 'mobx';
import SearchStore from './store';
import { readTopicsList, readUsersList, readThreadList, createFollow, deleteFollow } from '../../server';
import typeofFn from '@common/utils/typeof';

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
      hot: 1,
      content: search,
    };

    // 如果存在search字段，说明是在结果页发起的网络请求，此时只需要后台返回三条数据
    if (type === 1) {
      newPerPage = 3;
    }
  
    if ( !hasTopics ) {
      const res = await readTopicsList({ params: { filter: topicFilter, perPage: newPerPage, page: 1 } });
      const { code, data } = res;
      type === 0 ? this.setIndexTopics(code === 0 ? data : {}) : this.setSearchTopics(code === 0 ? data : {});
    }
    if ( !hasUsers ) {
      const res = await readUsersList({ params: { filter: { hot: 1, nickname: search }, perPage: newPerPage, page: 1 } });
      const { code, data } = res;
      type === 0 ? this.setIndexUsers(code === 0 ? data : {}) : this.setSearchUsers(code === 0 ? data : {});
    }
    if ( !hasThreads ) {
      const res = await readThreadList({ params: { filter: { sort: '3', search }, perPage: newPerPage, page: 1 } });
      const { code, data } = res;
      type === 0 ? this.setIndexThreads(code === 0 ? data : {}) : this.setSearchThreads(code === 0 ? data : {});
    }
  };

  /**
   * 发现模块 - 更多话题
   * @param {object} search * 搜索值
   * @returns {object} 处理结果
   */
  @action
  async getTopicsList({ search = '', hot = 0, perPage = 10, page = 1 } = {}) {
    const topicFilter = {
      hot: hot,
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
  async getUsersList({ search = '', hot = 0, perPage = 10, page = 1  } = {}) {
    const result = await readUsersList({ params: { filter: { hot, nickname: search }, perPage, page } });

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
    const result = await readThreadList({ params: { sequence: '0', filter: { sort: '3', search }, perPage, page } });

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
   const result = await createFollow({ data: { toUserId: userId } });
   if (result.code === 0 && result.data) {
     return result.data;
   }
   return null;
 };

 /**
 * 发现模块 - 取消关注
 * @param {object} search * 搜索值
 * @returns {object} 处理结果
 */
  @action
  async cancelFollow({ id, type }) {
    const result = await deleteFollow({ data: { id, type: type } });
    if (result.code === 0 && result.data) {
      return result.data;
    }
    return null;
  };

  /**
   * 更新用户状态
   * @param {number} userId 用户id
   * @param {object}  obj 更新数据
   * @param {boolean} obj.isFollow 是否更新点赞
   * @returns
   */
   @action
   updateActiveUserInfo(userId, obj = {}) {
    const users = this.findAssignUser(userId)

    users?.forEach(item => {
      this.updateInfo(item, obj)
    })
   }

   @action
  updateInfo(dataSource, obj) {
    if (!dataSource) {
      return
    }
    const { index, data, store } = dataSource;

    // 更新点赞
    const { isFollow } = obj;
    if (!typeofFn.isUndefined(isFollow) && !typeofFn.isNull(isFollow)) {
      data.isFollow = isFollow;
    }

    if (store?.pageData) {
      const newArr = store.pageData.slice()
      newArr[index] = data;
      store.pageData = newArr
    }
  }

   // 获取指定的用户数据
  findAssignUser(userId) {
    const users = []
    if (this.indexUsers) {
      const { pageData = [] } = this.indexUsers;
      pageData.forEach((item, index) => {
        if (item.userId === userId) {
          users.push(
            { index, data: item, store: this.indexUsers}
          )
        }
      })
    }

    if (this.users) {
      const { pageData = [] } = this.users;
      pageData.forEach((item, index) => {
        if (item.userId === userId) {
          users.push(
            { index, data: item, store: this.users }
          )
        }
      })
    }
    return users
  }

  /**
   * 支付成功后，更新帖子列表指定帖子状态
   * @param {number} threadId 帖子id
   * @param {object}  obj 更新数据
   * @returns
   */
   @action
   updatePayThreadInfo(threadId, obj) {
     const targetThreads = this.findAssignThread(threadId);

     targetThreads.forEach(targetThread => {
      const { index, store } = targetThread;
      if (store?.pageData) {
        store.pageData[index] = obj;
      }
     })
   }
 
   /**
    * 更新帖子列表指定帖子状态
    * @param {number} threadId 帖子id
    * @param {object}  obj 更新数据
    * @param {boolean} obj.isLike 是否更新点赞
    * @param {boolean} obj.isPost 是否更新评论数
    * @param {boolean} obj.user 当前操作的用户
    * @returns
    */
   @action
   updateAssignThreadInfo(threadId, obj = {}) {
     const targetThreads = this.findAssignThread(threadId);

     targetThreads.forEach(targetThread => {
      if (!targetThread) return;
        const { index, data, store } = targetThread;
    
        // 更新点赞
        const { isLike, isPost, isShare, user } = obj;
        if (!typeofFn.isUndefined(isLike) && !typeofFn.isNull(isLike) &&
        user && data.likeReward && data.likeReward.users) {
          data.isLike = isLike;

          const theUserId = user.userId || user.id;
          console.log("On Search page")

          if (isLike) {
            console.log("LIKING: ")
            console.log("BEFORE data.likeReward.users", data.likeReward.users);
    
            const userAdded = { userId: theUserId, avatar: user.avatarUrl, username: user.username };

            // 添加当前用户到按过赞的用户列表
            data.likeReward.users = data.likeReward.users.length ?
                                    [userAdded, ...data.likeReward.users]:
                                    [userAdded];

          } else {
            console.log("DISLIKING: ")
            console.log("BEFORE data.likeReward.users", data.likeReward.users);
            // 从按过赞用户列表中删除当前用户
            data.likeReward.users = data.likeReward.users.length ?
                                    [...data.likeReward.users].filter(item => {
                                      return (item.userId !== theUserId)
                                    }) :
                                    data.likeReward.users;
          }
          console.log("AFTER data.likeReward.users", data.likeReward.users);

          data.likeReward.likePayCount = data.likeReward.users.length;
        }
    
        // 更新评论
        if (!typeofFn.isUndefined(isPost) && !typeofFn.isNull(isPost)) {
          data.likeReward.postCount = isPost ? data.likeReward.postCount + 1 : data.likeReward.postCount - 1;
        }
    
        // 更新分享
        if (!typeofFn.isUndefined(isShare) && !typeofFn.isNull(isShare)) {
          data.likeReward.shareCount = isShare ? data.likeReward.shareCount + 1 : data.likeReward.shareCount - 1;
        }
    
        if (store?.pageData) {
          store.pageData[index] = data;
        }
     })
   }

   // 获取指定的帖子数据
  findAssignThread(threadId) {
    const threadArr = []
    if (this.threads) {
      const { pageData = [] } = this.threads;
      for (let i = 0; i < pageData.length; i++)  {
        if (pageData[i].threadId === threadId) {
          threadArr.push({ index: i, data: pageData[i], store: this.threads });
        }
      }
    }

    if (this.indexThreads) {
      const { pageData = [] } = this.indexThreads;
      for (let i = 0; i < pageData.length; i++)  {
        if (pageData[i].threadId === threadId) {
          threadArr.push({ index: i, data: pageData[i], store: this.indexThreads });
        }
      }
    }

    return threadArr
  }
}

export default SearchAction;
