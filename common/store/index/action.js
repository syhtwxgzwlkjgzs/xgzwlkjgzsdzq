import { action } from 'mobx';
import IndexStore from './store';
import { readCategories, readStickList, readThreadList, updatePosts, createThreadShare, readRecommends } from '@server';
import typeofFn from '@common/utils/typeof';

class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  /**
   * 触发筛选数据
   * @param {*} param0
   */
  @action
  async screenData({ filter = {}, sequence = 0, perPage = 10, page = 1 } = {}) {
    this.threads = null;
    this.sticks = null;

    this.getRreadStickList(filter.categoryids);
    this.getReadThreadList({ filter, sequence, perPage, page });
  }

  /**
   * 获取帖子数据
   * @returns
   */
  @action
  async getReadThreadList({ filter = {}, sequence = 0, perPage = 10, page = 1 } = {}) {
    // 过滤空字符串
    const newFilter = filter;
    if (filter.categoryids && (filter.categoryids instanceof Array)) {
      const newCategoryIds = filter.categoryids?.filter(item => item);
      if (!newCategoryIds.length) {
        delete newFilter.categoryids;
      }
    }

    const result = await readThreadList({ params: { perPage, page, filter: newFilter, sequence } });
    if (result.code === 0 && result.data) {
      if (this.threads && result.data.pageData && page !== 1) {
        this.threads.pageData.push(...result.data.pageData);
        const newPageData = this.threads.pageData.slice();
        this.setThreads({ ...result.data, pageData: newPageData });
      } else {
        // 首次加载
        this.setThreads(result.data);
      }
      return result.data;
    }
    return null;
  }

  /**
   * 获取分类数据
   * @returns
   */
  @action.bound
  async getReadCategories() {
    const result = await readCategories();
    if (result.code === 0 && result.data) {
      const data = [...result.data];
      this.setCategories(data);
      return this.categories;
    }
    return null;
  }

  /**
   * 获取置顶数据
   * @returns
   */
  @action
  async getRreadStickList(categoryIds = []) {
    const result = await readStickList({ params: { categoryIds } });
    if (result.code === 0 && result.data) {
      this.setSticks(result.data);
      return this.sticks;
    }
    return null;
  }

  // 获取指定的帖子数据
  findAssignThread(threadId) {
    if (this.threads) {
      const { pageData = [] } = this.threads;
      for (let i = 0; i < pageData.length; i++)  {
        if (pageData[i].threadId === threadId) {
          return { index: i, data: pageData[i] };
        }
      }
      return null;
    }
  }

  /**
   * 写入分类数据
   * @param {Object} data
   */
  @action.bound
  setCategories(data) {
    this.categories = data;
  }

  /**
   * 根据 ID 获取当前选中的类别
   * @param {number} id 帖子类别id
   * @returns 选中的帖子详细信息
   */
  @action
  getCategorySelectById(id) {
    let parent = {};
    let child = {};
    if (this.categories && this.categories.length && id) {
      this.categories.forEach((item) => {
        const { children } = item;
        if (item.pid === id) {
          parent = item;
          if (children && children.length > 0) [child] = children;
        } else {
          if (children && children.length > 0) {
            children.forEach((elem) => {
              if (elem.pid === id) {
                child = elem;
                parent = item;
              }
            });
          }
        }
      });
    }
    return { parent, child };
  }

  /* 写入置顶数据
   * @param {Object} data
   */
  @action
  setSticks(data) {
    this.sticks = data;
  }

  /**
   * 写入帖子数据
   * @param {Object} data
   */
  @action
  setThreads(data) {
    this.threads = data;
  }

  /**
   * 支付成功后，更新帖子列表指定帖子状态
   * @param {number} threadId 帖子id
   * @param {object}  obj 更新数据
   * @returns
   */
  @action
  updatePayThreadInfo(threadId, obj) {
    const targetThread = this.findAssignThread(threadId);
    const { index } = targetThread;
    if (this.threads?.pageData) {
      this.threads.pageData[index] = obj;
    }
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
    const targetThread = this.findAssignThread(threadId);

    if (!targetThread) return;
    const { index, data } = targetThread;

    // 更新点赞
    const { updateType, updatedInfo, user } = obj;
    const { isLiked, isPost, isFavorite:isShare, likeCount, replyCount } = updatedInfo;

    if (updateType === 'like' && !typeofFn.isUndefined(isLiked) && !typeofFn.isNull(isLiked)
          && user && data.likeReward?.users) {

      const theUserId = user.userId || user.id;
      data.isLike = isLiked;

      if (isLiked) {
        const userAdded = { userId: theUserId, avatar: user.avatarUrl, username: user.username };

        // 添加当前用户到按过赞的用户列表
        data.likeReward.users = data.likeReward.users.length ?
                                [userAdded, ...data.likeReward.users]:
                                [userAdded];
      } else {
        // 从按过赞用户列表中删除当前用户
        data.likeReward.users = data.likeReward.users.length ?
                                [...data.likeReward.users].filter(item => {
                                  return (item.userId !== theUserId)
                                }) :
                                data.likeReward.users;
      }
      data.likeReward.likePayCount = likeCount;
    }

    // 更新评论
    if (updateType === 'comment' && !typeofFn.isUndefined(isPost) && !typeofFn.isNull(isPost)) {
      data.likeReward.postCount = isPost ? data.likeReward.postCount + 1 : data.likeReward.postCount - 1;
    }

    // 更新分享
    if (updateType === 'share' && !typeofFn.isUndefined(isShare) && !typeofFn.isNull(isShare)) {
      data.likeReward.shareCount = isShare ? data.likeReward.shareCount + 1 : data.likeReward.shareCount - 1;
    }

    if (this.threads?.pageData) {
      this.threads.pageData[index] = data;
    }
  }

  /**
   * 添加帖子
   * @param {obj} threadInfo
   */
  @action
  addThread(threadInfo) {
    const { pageData } = this.threads;
    if (pageData) {
      pageData.unshift(threadInfo);
      this.threads.pageData = this.threads.pageData.slice();
    }
  }

  /**
   * 点赞
   * @param {string | number} pid 评论id
   * @param {string | number} id 帖子id
   * @param {string | number} data 附件信息
   */
  @action
  async updateThreadInfo({ pid, id, data = {} } = {}) {
    return await updatePosts({ data: { pid, id, data } });
  };

  /**
   * 分享
   * @param {string | number} threadId 帖子id
   */
  @action
  async updateThreadShare({ threadId } = {}) {
    return await createThreadShare({ data: { threadId } });
  };

  /**
   * 根据 ID 获取当前选中的类别
   * @param {number} id 帖子类别id
   * @returns 选中的帖子详细信息
   */
   @action
   async getRecommends({ categoryIds = [] } = {}) { 
    this.updateRecommendsStatus('loading');
    try {
      const result = await readRecommends({ params: { categoryIds } })
      if (result.code === 0 && result.data) {
        this.setRecommends(result.data);
        this.updateRecommendsStatus('none');
        return this.recommends;
      }
    } catch(err) {
      console.err(err);
      this.updateRecommendsStatus('none');
      return null
    }
   }

  /**
   * 推荐帖子
   * @param {Object} data
   */
  @action
  setRecommends(data) {
    this.recommends = data;
  }
  @action
  updateRecommendsStatus(status) {
    this.recommendsStatus = status;
  }

}

export default IndexAction;
