import { observable } from 'mobx';
class SearchStore {
  // 发现页
  @observable indexTopics = { pageData: [] }
  @observable indexUsers = { pageData: [] }
  @observable indexThreads = { pageData: [] }

  // 更多页
  @observable topics = { pageData: [] }
  @observable users = { pageData: [] }
  @observable threads = { pageData: [] }

  // 搜索页
  @observable searchTopics = { pageData: [] }
  @observable searchUsers = { pageData: [] }
  @observable searchThreads = { pageData: [] }
}

export default SearchStore;
