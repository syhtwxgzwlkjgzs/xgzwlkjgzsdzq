import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable categories = null;
}

export default IndexStore;
