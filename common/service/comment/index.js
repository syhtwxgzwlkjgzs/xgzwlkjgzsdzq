import { readReplyList } from '@server';

export default ({ comment: CommentStore }) => ({
  // 回复：回复评论 + 回复回复
  async createReply(params) {},

  // 点赞: 评论点赞 + 回复点赞
  async like() {},

  // 删除
  async delete() {},

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
