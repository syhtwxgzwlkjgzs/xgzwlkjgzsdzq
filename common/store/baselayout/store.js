import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable home = -1;

  @observable search = -1;

  @observable isJumpingToTop = false;

}

export default IndexStore;
