import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable categories = [];

  @observable sticks = [];

  @observable threads = {};
}

export default IndexStore;
