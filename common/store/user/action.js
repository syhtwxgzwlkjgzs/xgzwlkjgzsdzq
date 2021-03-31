import { observable, action } from 'mobx';
import SiteStore from './store';
class UserAction extends SiteStore {
  constructor(props) {
    super(props);
  }

  @action
  setUserInfo(data) {
    this.userInfo = data;
  }
}

export default UserAction;
