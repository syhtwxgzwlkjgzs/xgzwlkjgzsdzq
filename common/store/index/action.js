import { action } from 'mobx';
import IndexStore from './store';
class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  @action
  setCategories(data) {
    this.categories = data;
  }
}

export default IndexAction;
