import { readReplyList, updateComment } from '@server';

export default ({ comment: CommentStore, thread: ThreadStore }) => ({
  // 回复：回复评论 + 回复回复
  async createReply(params) {},

  /**
   * 点赞: 评论点赞 + 回复点赞
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 评论id
   * @param {boolean} params.isLiked 是否点赞
   * @returns {object} 处理结果
   */
  async updateLiked(params) {
    const { id, isLiked } = params;
    if (!id) {
      return {
        msg: '评论id不存在',
        success: false,
      };
    }

    const requestParams = {
      pid: id,
      isLiked: !!isLiked,
    };
    const res = await updateComment({ data: requestParams });

    if (res?.data && res.code === 0) {
      CommentStore.setCommentDetailField('isLiked', !!isLiked);

      // 更新评论列表的单项
      ThreadStore.setCommentListDetailField(id, 'isLiked', !!isLiked);

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

  // 删除评论
  async delete(commentId) {
    if (!commentId) {
      return {
        success: false,
        msg: '评论id不存在',
      };
    }
    const requestParams = {
      pid: commentId,
      isDeleted: true,
    };

    const res = await updateComment({ data: requestParams });
    if (res.code === 0) {
      return {
        success: false,
        msg: '删除成功',
      };
    }

    return {
      msg: res.msg,
      success: false,
    };
  },

  /**
   * 加载所有的回复列表
   * @param {object} parmas * 参数
   * @param {number} parmas.id * 评论id
   * @param {string} params.sort 'createdAt' | '-createdAt' 排序条件
   * @returns {object} 处理结果
   */
  async getReplyList(params) {
    const { id, sort = 'createdAt' } = params;

    if (!id) {
      return {
        msg: '评论id不存在',
        success: false,
      };
    }

    const requestParams = {
      filter: { thread: id },
      sort,
    };

    const res = await readReplyList({ data: requestParams });

    if (res?.data?.pageData) {
      CommentStore.setReplyList(res?.data?.pageData || []);

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
