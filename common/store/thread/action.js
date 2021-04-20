import { action } from 'mobx';
import ThreadStore from './store';
class ThreadAction extends ThreadStore {
  constructor(props) {
    super(props);
  }

  @action
  setThreadData(data) {
    this.threadData = data;
    this.threadData.id = data.threadId;
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
    this.totalPage = data;
  }
}

export default ThreadAction;
