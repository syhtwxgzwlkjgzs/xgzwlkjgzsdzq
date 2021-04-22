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
    for ( let i = 0; i < pageData.length; i++)  {
      if ( pageData[i].threadId === threadId ) {
        return {index: i, data: pageData[i]};
      }
    }
    return null;
  }

  @action
  setCategories(data) {
    this.categories = data;
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
   * @returns 
   */
  @action
  updateAssignThreadInfo(threadId, obj = {}) {
    const targetThread = this.findAssignThread(threadId);
    if ( !targetThread ) return;
    const { index, data } = targetThread;
    const { isLike } = obj;
    if ( !typeofFn.isUndefined(isLike) && !typeofFn.isNull(isLike) ) {
      data.isLike = isLike;
    }
    if ( this.threads && this.threads.pageData ) {
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
    if ( pageData ) {
      pageData.unshift(threadInfo);
      this.threads.pageData = this.threads.pageData.slice();
    }
  }
}

export default IndexAction;
