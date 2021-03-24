import { observable, action } from 'mobx';
import IndexStore from './store';
class IndexAction extends IndexStore {
  constructor() {
    super();
  }
  
  @action
  setCategories(data) {
    this.categories = data;
  }
}

export default IndexAction;
