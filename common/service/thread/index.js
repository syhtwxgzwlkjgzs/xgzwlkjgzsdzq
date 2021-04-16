import { updateThreads, readCommentList, createPosts } from '@server';

export default ({ thread: ThreadStore }) => ({
  /**
   * 帖子收藏
   * @param { number} params.id 帖子id
   * @param { boolean} params.isFavorite 是否收藏
   * @returns {object} 处理结果
   */
  async updateFavorite(params) {
    const { id, isFavorite } = params;

    // 1. 验证参数
    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    // 2. 请求接口
    const requestParams = {
      id,
      isFavorite: !!isFavorite,
      isDraft: 0,
    };
    const res = await updateThreads({ data: requestParams });

    res.Code = 0;

    if (res.Code === 0) {
      // 3. 更新store
      ThreadStore.setThreadDetailField('isFavorite', !!isFavorite);

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
  },

  /**
   * 创建评论
   * @param {object} params * 参数
   * @param {number} params.id * 帖子id
   * @param {string} params.content * 评论内容
   * @param {array} params.attachments 附件内容
   * @returns {object} 处理结果
   */
  async createComment(params) {
    const { id, content, attachments } = params;
    if (!id || !content) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }

    const requestParams = {
      id,
      content,
      attachments,
    };

    const res = await createPosts({ data: requestParams });

    if (res?.data?.Data) {
      const { commentList } = ThreadStore;

      commentList.unshift(res?.data?.Data);

      ThreadStore.setCommentList(commentList);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  },

  /**
   * 帖子点赞
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {boolean} params.isLiked 是否点赞
   * @returns {object} 处理结果
   */
  async updateLiked(params) {
    const { id, isLiked } = params;
    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    const requestParams = {
      id,
      isLiked: !!isLiked,
      isDraft: 0,
    };
    const res = await updateThreads({ data: requestParams });

    if (res?.data && res.code === 0) {
      ThreadStore.setThreadDetailField('isLiked', !!isLiked);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  },

  /**
   * 帖子置顶
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {boolean} params.isSticky 是否置顶
   * @returns {object} 处理结果
   */
  async updateSticky(params) {
    const { id, isSticky } = params;
    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    const requestParams = {
      id,
      isSticky: !!isSticky,
      isDraft: 0,
    };
    const res = await updateThreads({ data: requestParams });

    if (res?.data && res.code === 0) {
      ThreadStore.setThreadDetailField('isSticky', !!isSticky);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  },

  /**
   * 帖子加精
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {boolean} params.isEssence 是否加精
   * @returns {object} 处理结果
   */
  async updateEssence(params) {
    const { id, isEssence } = params;
    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    const requestParams = {
      id,
      isEssence: !!isEssence,
      isDraft: 0,
    };
    const res = await updateThreads({ data: requestParams });

    if (res?.data && res.code === 0) {
      ThreadStore.setThreadDetailField('isEssence', !!isEssence);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  },

  // TODO:帖子打赏
  async reward() {},

  // TODO:帖子支付
  async pay() {},

  /**
   * 帖子收藏
   * @param { number } * id 帖子id
   * @returns {object} 处理结果
   */
  async delete(id) {
    // 1. 验证参数
    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    const requestParams = {
      id,
      isDelete: 1,
      isDraft: 0,
    };
    const res = await updateThreads({ data: requestParams });

    if (res?.data && res.code === 0) {
      ThreadStore.setThreadDetailField('isDelete', 1);

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
  },

  /**
   * 回复评论
   * @param {object} params * 参数
   * @param {number} params.id * 帖子id
   * @param {number} params.id * 帖子id
   * @param {string} params.content * 评论内容
   * @param {array} params.attachments 附件内容
   * @returns {object} 处理结果
   */
  async replyComment(params) {},

  /**
   * 加载评论列表
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 帖子id
   * @param {number} parmas.page 页码
   * @param {number} parmas.perPage 页码
   * @param {string} params.sort 'createdAt' | '-createdAt' 排序条件
   * @returns {object} 处理结果
   */
  async loadCommentList(params) {
    const { id, page = 1, perPage = 10, sort = 'createdAt' } = params;

    if (!id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    const requestParams = {
      filter: { thread: id },
      sort,
      page,
      perPage,
    };

    const res = await readCommentList({ data: requestParams });

    if (res?.data?.pageData) {
      let { commentList } = ThreadStore;
      commentList = page === 1 ? res?.data?.pageData || [] : commentList.concat(res?.data?.pageData);

      this.props.thread.setCommentList(commentList);

      return {
        msg: '操作成功',
        success: true,
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  },
});
