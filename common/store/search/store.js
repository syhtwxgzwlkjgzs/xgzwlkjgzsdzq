import { observable } from 'mobx';
class SearchStore {
  constructor() {}

  @observable topics = [];
  @observable users = [];
}

export default SearchStore;
