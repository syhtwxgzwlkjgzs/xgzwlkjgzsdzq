import { observable } from 'mobx';

class UserStore {
  constructor(props) {
    this.userInfo = props.userInfo ? props.userInfo : null;
  }
  @observable userInfo = null;
  @observable loginStatus = 'padding';
  @observable accessToken = null;
}

export default UserStore;
