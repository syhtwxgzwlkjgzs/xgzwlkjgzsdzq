import { action } from 'mobx';
import ThreadStore from './store';
import { updatePosts, readCommentList } from '@server';

class ThreadAction extends ThreadStore {
  constructor(props) {
    super(props);
  }

  @action
  reset() {
    this.threadData = null;
    this.commentList = null;
    this.totalCount = 0;
  }

  @action
  setThreadData(data) {
    this.threadData = data;
    this.threadData.id = data.threadId;
  }

  @action
  setThreadDetailLikePayCount(data) {
    this.threadData.likeReward.likePayCount = data;
  }

  @action
  setThreadDetailEssence(data) {
    this.threadData.displayTag.isEssence = data;
  }

  @action
  setThreadDetailField(key, data) {
    this.threadData[key] = data;
  }

  @action
  setCommentList(list) {
    this.commentList = list;
  }

  @action
  setCommentListDetailField(commentId, key, value) {
    if (this.commentList?.length) {
      this.commentList.forEach((comment) => {
        if (comment.id === commentId) {
          comment[key] = value;
        }
      });
    }
  }

  @action
  setTotalCount(data) {
    this.totalCount = data;
  }

  /**
   * 帖子收藏
   * @param { number} params.id 帖子id
   * @param { boolean} params.isFavorite 是否收藏
   * @returns {object} 处理结果
   */
  async updateFavorite(params) {
    const { id, pid, isFavorite } = params;
    if (!id || !pid) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }

    const requestParams = {
      id,
      pid,
      data: {
        attributes: {
          isFavorite: !!isFavorite,
        },
      },
    };

    const res = await updatePosts({ data: requestParams });

    if (res.code === 0) {
      // 3. 更新store
      this.setThreadDetailField('isFavorite', !!isFavorite);

      // 4. 返回成功
      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  }

  /**
   * 帖子点赞
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {number} parmas.pid * 帖子评论od
   * @param {boolean} params.isLiked 是否点赞
   * @returns {object} 处理结果
   */
  @action
  async updateLiked(params, IndexStore) {
    const { id, pid, isLiked } = params;
    if (!id || !pid) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }

    const requestParams = {
      id,
      pid,
      data: {
        attributes: {
          isLiked: !!isLiked,
        },
      },
    };
    const res = await updatePosts({ data: requestParams });

    if (res?.data && res.code === 0) {
      this.setThreadDetailField('isLike', !!isLiked);
      this.setThreadDetailLikePayCount(res.data.likeCount);

      // 更新首页store
      IndexStore && IndexStore.updateAssignThreadInfo(id, {
        isLike: !!isLiked,
      });

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  }

  /**
   * 帖子置顶
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {number} parmas.pid * 帖子评论id
   * @param {boolean} params.isSticky 是否置顶
   * @returns {object} 处理结果
   */
  @action
  async updateSticky(params) {
    const { id, pid, isSticky } = params;
    if (!id || !pid) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }

    const requestParams = {
      id,
      pid,
      data: {
        attributes: {
          isSticky: !!isSticky,
        },
      },
    };
    const res = await updatePosts({ data: requestParams });

    if (res?.data && res.code === 0) {
      this.setThreadDetailField('isSticky', !!isSticky);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  }

  /**
   * 帖子加精
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {boolean} params.isEssence 是否加精
   * @returns {object} 处理结果
   */
  @action
  async updateEssence(params) {
    const { id, pid, isEssence } = params;
    if (!id || !pid) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }

    const requestParams = {
      id,
      pid,
      data: {
        attributes: {
          isEssence: !!isEssence,
        },
      },
    };

    const res = await updatePosts({ data: requestParams });

    if (res?.data && res.code === 0) {
      this.setThreadDetailEssence(!!isEssence);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  }

  // TODO:帖子打赏
  async reward() {}

  // TODO:帖子支付
  async pay() {}

  /**
   * 帖子删除
   * @param { number } * id 帖子id
   * @returns {object} 处理结果
   */
  @action
  async delete(id, pid) {
    if (!id || !pid) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }

    const requestParams = {
      id,
      pid,
      data: {
        attributes: {
          isDeleted: 1,
        },
      },
    };
    const res = await updatePosts({ data: requestParams });

    if (res?.data && res.code === 0) {
      this.setThreadDetailField('isDelete', 1);

      // TODO: 删除帖子列表中的数据

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  }

  /**
   * 加载评论列表
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {number} parmas.page 页码
   * @param {number} parmas.perPage 页码
   * @param {string} params.sort 'createdAt' | '-createdAt' 排序条件
   * @returns {object} 处理结果
   */
  @action
  async loadCommentList(params) {
    const { id, page = 1, perPage = 10, sort = 'createdAt' } = params;
    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    const requestParams = {
      filter: {
        thread: Number(id),
      },
      sort,
      page,
      perPage,
    };

    const res = await readCommentList({ params: requestParams });

    if (res?.data?.pageData) {
      let { commentList } = this;

      page === 1 ? (commentList = res?.data?.pageData || []) : commentList.push(...(res?.data?.pageData || []));

      this.setCommentList(this.commentListAdapter(commentList));

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  }

  // 适配器
  commentListAdapter(list = []) {
    list.forEach((item) => {
      const { lastThreeComments } = item;
      if (lastThreeComments?.length > 1) {
        item.lastThreeComments = [lastThreeComments[0]];
      }
    });
    return list;
  }
}

export default ThreadAction;
