import { action } from 'mobx';
import SearchStore from './store';
class SearchAction extends SearchStore {
  constructor(props) {
    super(props);
  }

  @action
  setTopics(data) {
    this.topics = data;
  }
}

export default SearchAction;
