import { observable, action } from 'mobx';
import { get } from '@common/utils/get';

class ForumStore {
  constructor() {}
  @observable isPopup = false;
  @observable isNoMore = false;
  @observable usersPageData = null;
  @observable userPage = 1;
  @observable isLoading = true;
  @observable userTotal = 0;
  @observable threadsPageData = null;
  @observable threadTotal = 0;
  @observable updataTime = null;

  @action
  setUserPage(page) {
    this.userPage = page;
  }

  @action
  setIsPopup(is) {
    this.isPopup = is;
  }

  @action
  setIsLoading(is) {
    this.isLoading = is;
  }

  @action
  setUsersPageData(res) {
    const data = get(res, 'pageData', []);
    const total = get(res, 'totalCount', 0);
    const totalPage = get(res, 'totalPage', 0);
    const currentPage = get(res, 'currentPage', 0);
    this.usersPageData = this.usersPageData ? this.usersPageData?.concat(data) : data;
    this.userTotal = total;
    this.userPage = currentPage;
    this.isNoMore = currentPage >= totalPage;
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
