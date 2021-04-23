import { action } from 'mobx';
import IndexStore from './store';
import { readCategories, readStickList, readThreadList } from '@server';
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
    this.getRreadStickList();
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
    if (filter.categoryids) {
      const newCategoryIds = filter.categoryids.filter(item => item);
      if (!newCategoryIds.length) {
        delete newFilter.categoryids;
      }
    }

    const result = await readThreadList({ params: { perPage, page, filter: newFilter, sequence } });
    if (result.code === 0 && result.data) {
      if (this.threads && result.data.pageData) {
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
  @action
  async getReadCategories() {
    const result = await readCategories();
    if (result.code === 0 && result.data) {
      const data = [{ name: '全部', pid: '', children: [] }, ...result.data];
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
  async getRreadStickList() {
    const result = await readStickList();
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
  @action
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
   * 更新帖子列表指定帖子状态
   * @param {number} threadId 帖子id
   * @param {object}  obj 更新数据
   * @param {boolean} obj.isLike 是否更新点赞
   * @param {boolean} obj.isPost 是否更新评论数
   * @returns
   */
  @action
  updateAssignThreadInfo(threadId, obj = {}) {
    const targetThread = this.findAssignThread(threadId);
    if (!targetThread) return;
    const { index, data } = targetThread;

    // 更新点赞
    const { isLike, isPost } = obj;
    if (!typeofFn.isUndefined(isLike) && !typeofFn.isNull(isLike)) {
      data.isLike = isLike;
      data.likeReward.likePayCount = isLike ? data.likeReward.likePayCount + 1 : data.likeReward.likePayCount0 - 1;
    }

    // 更新评论
    if (!typeofFn.isUndefined(isPost) && !typeofFn.isNull(isPost)) {
      data.likeReward.postCount = isPost ? data.likeReward.postCount + 1 : data.likeReward.postCount - 1;
    }

    if (this.threads && this.threads.pageData) {
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
}

export default IndexAction;
