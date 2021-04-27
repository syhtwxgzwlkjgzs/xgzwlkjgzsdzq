import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable categories = null;

  @observable sticks = null;

  @observable threads = null;

  @observable recommends = null;
}

export default IndexStore;
