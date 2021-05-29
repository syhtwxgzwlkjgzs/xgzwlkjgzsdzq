import { observable, computed } from 'mobx';
class IndexStore {
  constructor() {}

  @observable categories = null;

  @observable sticks = null;

  @observable threads = null;

  @observable drafts = null;

  @computed get categoriesNoAll() {
    return (this.categories || []).filter(item => item.name !== '全部');
  }
  @observable recommends = null;
  @observable recommendsStatus = 'none'
  @observable filter = {}

  // 解决小程序popup被tabBar遮挡的问题
  @observable hiddenTabBar = false
}

export default IndexStore;
