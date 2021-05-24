import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable jumpToScrollingPos = -1;

  @observable isJumpingToTop = false;

}

export default IndexStore;
