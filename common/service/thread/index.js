import { readThreadDetail, updateThreads } from '@server';

export default props => ({
  /**
   * 收藏帖子
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
    console.log(res);

    if (res?.data && res.code === 0) {
      // 3. 更新store
      const { thread } = props;
      thread.setThreadFavorite(!!isFavorite);

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
   * @param {object} params 参数
   * @param {number} params.id 帖子id
   * @param {string} params.content 评论内容
   * @param {array} params.attacment 附件内容
   */
  async createComment(params) {
    const { id, content, attacment } = params;
    if (!id || !content) {
      return {
        msg: '参数不完整',
        success: false,
      };
    }
  },

  /**
   * 点赞
   * @param {object} parmas 参数
   * @param {number} parmas.id 帖子id
   * @param {boolean} params.isLiked 是否点赞
   */
  async updateLike(params) {
    const { id, isLiked } = params;
    if (id) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    try {
      const res = await updateThreads();

      return {
        msg: '操作成功',
        success: true,
      };
    } catch (error) {
      return {
        msg: error?.message || '未知错误',
        success: false,
      };
    }
  },

  // 打赏
  async reward() {},

  // 置顶
  async updateSticky() {},

  // 加精
  async updateEssence() {},

  // 删除
  async delete() {},

  // 支付
  async pay() {},

  // 回复
  async reply() {},

  // 评论排序
  async sort() {},
});
