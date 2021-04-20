import { action } from 'mobx';
import IndexStore from './store';
import { readCategories } from '@server';

class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  async fetchCategory() {
    const ret = await readCategories();
    const { code, data } = ret;
    this.setCategories(data || []);
    if (code === 0) return data;
    return [];
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
