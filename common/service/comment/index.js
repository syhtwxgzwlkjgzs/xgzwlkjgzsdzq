export default props => ({
  // 回复：回复评论 + 回复回复
  async createReply(params) {},

  // 点赞: 评论点赞 + 回复点赞
  async like() {},

  // 删除
  async delete() {},

  /**
   * 回复列表排序
   * @param {object} condition 排序条件
   * @param {string} condition.time 时间倒叙或正序
   * @returns {object} 处理结果
   */
  listSort(condition) {},
});
