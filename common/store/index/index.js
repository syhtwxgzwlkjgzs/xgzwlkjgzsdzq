import { action } from 'mobx';
import IndexStore from './store';

class IndexAction extends IndexStore {
  @action
  setCategories(data) {
    this.categories = data || [];
  }
}

const index = new IndexAction();
export default index;
