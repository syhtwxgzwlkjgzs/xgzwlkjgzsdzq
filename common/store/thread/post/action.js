import { action } from 'mobx';
import ThreadPostStore from './store';
import { readEmoji, readFollow, readProcutAnalysis, readTopics, createThread } from '@common/server';
import { LOADING_TOTAL_TYPE, THREAD_TYPE } from '@common/constants/thread-post';

class ThreadPostAction extends ThreadPostStore {
  /**
   * 发帖
   */
  @action.bound
  async createThread() {
    // 待更换为全局loading?
    // this.setLoadingStatus(LOADING_TOTAL_TYPE.emoji, true);
    const params = this.getCreateThreadParams();
    const ret = await createThread(params);
    // this.setLoadingStatus(LOADING_TOTAL_TYPE.emoji, false);
    // const { code, data = [] } = ret;
    // 相关数据处理待实际调用时修改
    // let emojis = [];
    // if (code === 0) emojis = data.map(item => ({ code: item.code, url: item.url }));
    // this.setEmoji(emojis);
    return ret;
  }


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
    const ret = await readFollow({ params });
    this.setLoadingStatus(LOADING_TOTAL_TYPE.follow, false);
    const { code, data } = ret;
    const { pageData } = data || {};
    if (code === 0) {
      if (page === 1) this.setFollow(pageData || []);
      else this.appendFollow(pageData || []);
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
      if (params.page === 1) this.setTopic(pageData || []);
      else this.appendTopic(pageData || []);
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
    this.follows = data || [];
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

  // 同步发帖数据到store
  @action.bound
  setPostData(data) {
    this.postData = { ...this.postData, ...data };
  }

  @action.bound
  setCategorySelected(data) {
    this.categorySelected = data || { parent: {}, child: {} };
  }

  /**
   * 获取格式化之后的插件对象信息，包括语音等
   */
  @action
  gettContentIndexes() {
    const { images, video, files, product, audio, redpacket, rewardQa } = this.postData;
    const imageIds = Object.values(images).map(item => item.id);
    const docIds = Object.values(files).map(item => item.id);
    const contentIndexes = {};
    if (imageIds.length > 0) {
      contentIndexes[THREAD_TYPE.image] = {
        tomId: THREAD_TYPE.image,
        body: { imageIds },
      };
    }
    if (video.id) {
      contentIndexes[THREAD_TYPE.video] = {
        tomId: THREAD_TYPE.video,
        body: { videoId: video.id },
      };
    }
    if (docIds.length > 0) {
      contentIndexes[THREAD_TYPE.file] = {
        tomId: THREAD_TYPE.file,
        body: { docIds },
      };
    }
    if (product.id) {
      contentIndexes[THREAD_TYPE.goods] = {
        tomId: THREAD_TYPE.goods,
        body: { ...product },
      };
    }
    if (audio.id) {
      contentIndexes[THREAD_TYPE.voice] = {
        tomId: THREAD_TYPE.voice,
        body: { audioId: audio.id },
      };
    }
    // TODO:需要支付，缺少 orderId
    if (redpacket.price) {
      contentIndexes[THREAD_TYPE.redPacket] = {
        tomId: THREAD_TYPE.redPacket,
        body: { ...redpacket },
      };
    }
    // TODO:需要支付，缺少 orderId
    if (rewardQa.times) {
      contentIndexes[THREAD_TYPE.qa] = {
        tomId: THREAD_TYPE.qa,
        body: { expiredAt: rewardQa.times, price: rewardQa.value, type: 0 },
      };
    }
    return contentIndexes;
  }

  /**
   * 获取发帖时需要的参数
   */
  @action
  getCreateThreadParams() {
    const { title, categoryId, contentText, position, price, attachmentPrice, freeWords } = this.postData;
    const params = {
      title, categoryId, content: {
        text: contentText,
      },
    };
    if (position.address) params.position = position;
    if (!!price) {
      params.price = price;
      params.freeWords = freeWords;
    }
    if (!!attachmentPrice) params.attachmentPrice = attachmentPrice;
    if (this.postData.draft) params.draft = this.postData.draft;
    if (this.postData.anonymous) params.anonymous = this.postData.anonymous;
    const contentIndexes = this.gettContentIndexes();
    if (Object.keys(contentIndexes).length > 0) params.content.indexes = contentIndexes;
    return params;
  }

  @action
  formatThreadDetailToPostData(detail) {
    const { title, categoryId, content, freeWords = 1 } = detail || {};
    const price = Number(detail.price);
    const attachmentPrice = Number(detail.attachmentPrice);
    let position = {};
    if (detail.position && detail.position.address) position = detail.position;
    const contentText = content && content.text;
    const contentindexes = (content && content.indexes) || {};
    let audio = {};
    let rewardQa = {};
    let product = {};
    let redpacket = {};
    let video = {};
    const images = {};
    const files = {};
    // 插件格式化
    Object.keys(contentindexes).forEach((index) => {
      const tomId = Number(contentindexes[index].tomId);
      if (tomId === THREAD_TYPE.image) {
        const imageBody = contentindexes[index].body || [];
        imageBody.forEach((item) => {
          images[item.id] = { ...item, type: item.fileType, name: item.fileName };
        });
      }
      if (tomId === THREAD_TYPE.file) {
        const fileBody = contentindexes[index].body || [];
        fileBody.forEach((item) => {
          files[item.id] = { ...item, type: item.fileType, name: item.fileName  };
        });
      }
      if (tomId === THREAD_TYPE.audio) audio = contentindexes[index].body;
      if (tomId === THREAD_TYPE.product) product = contentindexes[index].body;
      if (tomId === THREAD_TYPE.video) video = contentindexes[index].body;
      if (tomId === THREAD_TYPE.redpacket) redpacket = contentindexes[index].body;
      // expiredAt: rewardQa.times, price: rewardQa.value, type: 0
      if (tomId === THREAD_TYPE.reward) rewardQa = {
        ...contentindexes[index].body,
        times: contentindexes[index].body.expiredAt,
        value: contentindexes[index].body.price || 0,
      };
    });
    this.setPostData({
      title,
      categoryId,
      price,
      attachmentPrice,
      position,
      contentText,
      audio,
      rewardQa,
      product,
      redpacket,
      video,
      images,
      files,
      freeWords,
    });
  }
}

export default ThreadPostAction;
