import { action } from 'mobx';
import IndexStore from './store';
import { readCategories } from '@server';
import typeofFn from '@common/utils/typeof';
class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  async fetchCategory() {
    const ret = await readCategories();
    const { code, data } = ret;
    this.setCategories(data || []);
    if (code === 0) return data;
    return [];
  }

  findAssignThread(threadId) {
    const { pageData = [] } = this.threads;
    for (let i = 0; i < pageData.length; i++)  {
      if (pageData[i].threadId === threadId) {
        return { index: i, data: pageData[i] };
      }
    }
    return null;
  }

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

  @action
  setSticks(data) {
    this.sticks = data;
  }

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
