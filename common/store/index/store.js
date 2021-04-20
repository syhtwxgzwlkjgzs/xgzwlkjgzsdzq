import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable categories = null;

  @observable sticks = [];

  @observable threads = [];
}

export default IndexStore;
