import { observable } from 'mobx';

class UserStore {
  constructor(props) {
    this.userInfo = props.userInfo ? props.userInfo : null;
  }
  @observable userInfo = null;
  @observable loginStatus = 'padding';
  @observable accessToken = null;
  @observable weixinNickName = null;
}

export default UserStore;
