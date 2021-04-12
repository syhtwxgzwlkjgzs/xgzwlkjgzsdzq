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
  setThreadFavorite() {
    this.threadData.isFavorite = !this.threadData.isFavorite;
  }
}

export default ThreadAction;
