import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable jumpToScrollingPos = -1;

}

export default IndexStore;
