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
}

export default ThreadAction;
