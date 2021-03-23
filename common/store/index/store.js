import { observable } from 'mobx';

class IndexStore {
  // 文章种类
  @observable categories = [];
}

export default IndexStore;
