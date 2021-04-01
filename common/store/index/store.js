import { observable } from 'mobx';
class IndexStore {
  constructor(props = {}) {
    
  }
  
  @observable categories = null;
}

export default IndexStore;
