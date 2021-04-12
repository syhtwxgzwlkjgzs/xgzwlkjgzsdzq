import { readThreadDetail } from '@server';

export default props => ({
  /**
   * 收藏帖子
   * @param {string | number} threadId 帖子id
   * @returns {object} 处理结果
   */
  async collect(threadId) {
    // 1. 验证参数
    if (!threadId) {
      return {
        msg: '帖子id不存在',
        success: false,
      };
    }

    try {
      // 2. 请求接口
      const params = {
        pid: threadId,
      };
      const res = await readThreadDetail({ params });

      if (res?.data) {
        // 3. 更新store
        const { thread } = props;
        thread.setThreadFavorite(true);

        // 4. 返回成功
        return {
          msg: '操作成功',
          success: true,
        };
      }
    } catch (error) {
      return {
        msg: error?.message,
        success: false,
      };
    }
  },
});
