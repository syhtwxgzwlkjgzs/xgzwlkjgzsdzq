import { readStickList } from '@server';

export default props => ({
  /**
   * 获取置顶列表
   * @param {array} categoryId 类型id
   * @returns {object} 处理结果
   */
  async collect(categoryId) {
    

    try {
      // 2. 请求接口
      const params = {
        categoryId: [],
      };
      const res = await readStickList({ params });

      if (res?.data) {
        // 3. 更新store
        // const { thread } = props;
        // thread.setThreadFavorite(true);
        debugger

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
