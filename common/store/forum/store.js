import { observable, action } from 'mobx';
import { get } from '@common/utils/get';

class ForumStore {
  constructor() {}
  @observable isPopup = false;
  @observable usersPageData = [];
  @observable userTotal = 0;
  @observable threadsPageData = [];
  @observable threadTotal = 0;
  @observable updataTime = null;

  @action
  setIsPopup(is) {
    this.isPopup = is;
  }

  @action
  setUsersPageData(res) {
    const data = get(res, 'pageData', []);
    const total = get(res, 'totalCount', 0);
    this.usersPageData = data;
    this.userTotal = total;
  }

  @action
  setThreadsPageData(res) {
    const data = get(res, 'pageData', []);
    const time = get(data[0], 'createdAt', null);
    const total = get(res, 'totalCount', 0);
    this.threadsPageData = data;
    this.threadTotal = total;
    this.updataTime = time;
  }
}

export default ForumStore;
