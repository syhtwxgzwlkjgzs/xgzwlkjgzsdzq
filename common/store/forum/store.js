import { observable, computed } from 'mobx';
class ForumStore {
  constructor() {}
  @observable isPopup = false;
  @observable usersPageData = [];
  @observable isLoading = true;
  @observable userTotal = 0;
  @observable threadsPageData = [];
  @observable threadTotal = 0;
  @observable updataTime = null;
}

export default ForumStore;
