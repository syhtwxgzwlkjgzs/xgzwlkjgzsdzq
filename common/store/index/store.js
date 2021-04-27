import { observable, computed } from 'mobx';
class IndexStore {
  constructor() {}

  @observable categories = null;

  @observable sticks = null;

  @observable threads = null;

  @computed get categoriesNoAll() {
    return (this.categories || []).filter(item => item.name !== '全部');
  }
}

export default IndexStore;
