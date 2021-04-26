import { observable } from 'mobx';
class SearchStore {
  // 发现页
  @observable indexTopics = null
  @observable indexUsers = null
  @observable indexThreads = null

  // 更多页
  @observable topics = null
  @observable users = null
  @observable threads = null

  // 搜索页
  @observable searchTopics = null
  @observable searchUsers = null
  @observable searchThreads = null
}

export default SearchStore;
