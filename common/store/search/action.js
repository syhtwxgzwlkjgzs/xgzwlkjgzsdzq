import { action } from 'mobx';
import SearchStore from './store';
class SearchAction extends SearchStore {
  constructor(props) {
    super(props);
  }

  @action
  setIndexTopics(data) {
    this.indexTopics = data;
  }

  @action
  setIndexUsers(data) {
    this.indexUsers = data;
  }

  @action
  setIndexThreads(data) {
    this.indexThreads = data;
  }

  @action
  setTopics(data) {
    this.topics = data;
  }

  @action
  setUsers(data) {
    this.users = data;
  }

  @action
  setThreads(data) {
    this.threads = data;
  }

  @action
  setSearchTopics(data) {
    this.searchTopics = data;
  }

  @action
  setSearchUsers(data) {
    this.searchUsers = data;
  }

  @action
  setSearchThreads(data) {
    this.searchThreads = data;
  }
}

export default SearchAction;
