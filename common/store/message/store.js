import { observable, computed } from 'mobx';
import { get } from '../../utils/get';

class MessageStore {
  constructor(props) {}
  @observable userInfo = null;
  @observable loginStatus = 'padding';
  @observable accessToken = null;
  @observable weixinNickName = null;
  @observable permissions = null;

}

export default MessageStore;
