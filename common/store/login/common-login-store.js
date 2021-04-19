import { observable, action, computed } from 'mobx';
import { get } from '../../utils/get';

export default class commonLoginStore {
    @observable needToSetNickname = false;
    @observable needToCompleteExtraInfo = false;
    @observable needToBindPhone = false;
    @observable needToBindWechat = false;
    @observable sessionToken = '';

    @action
    setSessionToken(sessionToken) {
      this.sessionToken = sessionToken;
    }
}
