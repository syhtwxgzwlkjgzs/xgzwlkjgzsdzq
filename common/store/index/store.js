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

  @computed get categoriesNames () {
    const categoriesNoAll = (this.categories || []).filter(item => item.name !== '全部');
    const nameArr = [];
    console.log(categoriesNoAll);
    categoriesNoAll.forEach((item) => {
      nameArr.push({
        pid: item.pid,
        name: item.name
      })
      item.children.forEach((child) => {
        nameArr.push({
          pid: child.pid,
          name: `${item.name}/${child.name}`
        })
      });
    });
    return nameArr;
  }
  @observable recommends = null;
  @observable recommendsStatus = 'none'

  @observable filter = {
    categoryids: ['all'],
    sequence: 0,
    sort: 1,
    attention: 0,
    types: 'all',
    essence: 0
  }

  // 解决小程序popup被tabBar遮挡的问题
  @observable hiddenTabBar = false

  // 小程序scroll-view被scroll-view嵌套，子元素不能使用同名属性来触发事件
  @observable hasOnScrollToLower = true; // 值为false时，第一层嵌套onScrollToLower被设置为null用于执行下一层onScrollToLower
}

export default IndexStore;
