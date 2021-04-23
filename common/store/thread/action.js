import { action } from 'mobx';
import ThreadStore from './store';
import { readThreadDetail } from '@server';

class ThreadAction extends ThreadStore {
  constructor(props) {
    super(props);
  }

  /**
   * 获取帖子详细信息
   * @param {number} id 帖子id
   * @returns 帖子详细信息
   */
  @action
  async fetchThreadDetail(id) {
    const params = { threadId: id };
    const ret = await readThreadDetail({ params });
    const { code, data } = ret;
    if (code === 0) this.setThreadData(data);
    return ret;
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
}

export default ThreadAction;
