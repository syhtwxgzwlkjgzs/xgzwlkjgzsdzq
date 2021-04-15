/**
 * 创建帖子页面的 Store
 */
import { observable } from 'mobx';
import { LOADING_TOTAL_TYPE } from '@common/constants/thread-post';

class ThreadPostStore {
  /**
   * 表情列表
   */
  @observable emojis = [];
  /**
   * 商品信息
   */
  @observable product = {};
  /**
   * 推荐的话题列表，选择话题的时候需要
   */
  @observable topics = [];
  /**
   * 我的关注
   */
  @observable follows = [];
  /**
   * 加载状态
   */
  @observable loading = {
    [LOADING_TOTAL_TYPE.product]: false,
    [LOADING_TOTAL_TYPE.topic]: false,
    [LOADING_TOTAL_TYPE.emoji]: false,
    [LOADING_TOTAL_TYPE.follow]: false,
  };
}

export default ThreadPostStore;
