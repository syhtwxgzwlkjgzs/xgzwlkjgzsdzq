import { action } from 'mobx';
import IndexStore from './store';
class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  @action
  setCategories(data) {
    this.categories = data;
  }

  @action
  setSticks(data) {
    this.sticks = data;
  }

  @action
  setThreads(data) {
    this.threads = data;
  }
}

export default IndexAction;
