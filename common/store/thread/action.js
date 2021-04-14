import { action } from 'mobx';
import ThreadStore from './store';

class ThreadAction extends ThreadStore {
  constructor(props) {
    super(props);
  }

  @action
  setThreadData(data) {
    this.threadData = data;
  }

  @action
  setThreadDetailField(key, data) {
    this.threadData[key] = data;
  }

  @action
  setCommentList(list = []) {
    this.commentList = list;
  }
}

export default ThreadAction;
