import { action } from 'mobx';
import ThreadStore from './store';

import MockThreadData from './data';

class ThreadAction extends ThreadStore {
  constructor(props) {
    super(props);
  }

  @action
  setThreadData(data) {
    // this.threadData = data;
    this.threadData = MockThreadData.thread;
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
