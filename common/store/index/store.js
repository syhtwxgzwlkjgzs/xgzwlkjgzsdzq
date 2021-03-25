import { observable } from 'mobx';
class IndexStore {
  constructor(props = {}) {
    this.categories = props.categories;
  }
  @observable categories = null;
}

export default IndexStore;
