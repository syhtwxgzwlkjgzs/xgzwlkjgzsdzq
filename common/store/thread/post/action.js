import { action } from 'mobx';
import ThreadPostStore from './store';
import { readEmoji, readFollow, readProcutAnalysis, readTopics } from '@common/server';
import { LOADING_TOTAL_TYPE } from '@common/constants/thread-post';

class ThreadPostAction extends ThreadPostStore {
  /**
   * 获取所有表情
   */
  @action.bound
  async fetchEmoji() {
    this.setLoadingStatus(LOADING_TOTAL_TYPE.emoji, true);
    const ret = await readEmoji();
    this.setLoadingStatus(LOADING_TOTAL_TYPE.emoji, false);
    const { code, data = [] } = ret;
    let emojis = [];
    if (code === 0) emojis = data.map(item => ({ code: item.code, url: item.url }));
    this.setEmoji(emojis);
    return ret;
  }

  /**
   * 获取关注列表 [有些参数觉得没有必要，在这里没有列举出来]
   * @param {object} options 参数
   * @param {number} options.page 页码
   * @param {number} options.perPage 每页数据条数
   * @param {number} [default=1] options.filter.type 不传或者 0：所有；1：我的关注；2：我的粉丝
   */
  @action.bound
  async fetchFollow(options = {}) {
    const { filter = {}, page = 1, ...others } = options;
    const params = {
      perPage: 20,
      ...others,
      filter: {
        type: 1,
        ...filter,
      },
      page,
    };
    this.setLoadingStatus(LOADING_TOTAL_TYPE.follow, true);
    // TODO: 待sdk更新后在去掉 isValidate
    const ret = await readFollow({ params, isValidate: false });
    this.setLoadingStatus(LOADING_TOTAL_TYPE.follow, false);
    const { code, data } = ret;
    const { pageData = [] } = data || {};
    if (code === 0) {
      if (page === 1) this.setFollow(pageData);
      else this.appendFollow(pageData);
    }
    return ret;
  }

  /**
   * 根据商品贴的商品链接获取到商品信息
   * @param {object} options 参数
   * @param {address} options.address 商品链接
   */
  @action.bound
  async fetchProductAnalysis(options = {}) {
    this.setLoadingStatus(LOADING_TOTAL_TYPE.product, true);
    const ret = await readProcutAnalysis({ params: options });
    const { code, data = {} } = ret;
    if (code === 0) this.setProduct(data);
    this.setLoadingStatus(LOADING_TOTAL_TYPE.product, false);
    return ret;
  }

  @action.bound
  async fetchTopic(options = {}) {
    this.setLoadingStatus(LOADING_TOTAL_TYPE.topic, true);
    const params = {
      page: 1,
      perPage: 20,
      ...options,
    };
    const ret = await readTopics({ params });
    const { code, data } = ret;
    const { pageData = [] } = data || {};
    if (code === 0) {
      if (params.page === 1) this.setTopic(pageData);
      else this.appendTopic(pageData);
    }
    this.setLoadingStatus(LOADING_TOTAL_TYPE.topic, false);
    return ret;
  }

  // 设置 loading 状态
  @action.bound
  setLoadingStatus(type, status) {
    this.loading[type] = status;
  }

  // 设置表情
  @action.bound
  setEmoji(data) {
    this.emojis = data;
  }

  // 设置关注
  @action.bound
  setFollow(data) {
    this.follows = data;
  }

  // 附加关注
  @action.bound
  appendFollow(data) {
    this.follows = [...this.follows, ...data];
  }

  // 设置商品信息
  @action.bound
  setProduct(data) {
    this.product = data;
  }

  // 设置话题列表
  @action.bound
  setTopic(data) {
    this.topics = data;
  }

  // 附加话题列表
  @action.bound
  appendTopic(data) {
    this.topics = [...this.topics, ...data];
  }
}

export default ThreadPostAction;
