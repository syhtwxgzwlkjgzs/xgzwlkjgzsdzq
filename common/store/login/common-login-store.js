import { observable, action, computed } from 'mobx';
import { get } from '../../utils/get';


const USER_STATUS_MAP = {
  '-4009': '您的账号已禁用',
  2: '您的账号注册正在审核中，请耐心等待',
  '-4007': '您的账号注册审核不通过',
};

export default class commonLoginStore {
    @observable needToSetNickname = false;
    @observable needToCompleteExtraInfo = false;
    @observable needToBindPhone = false;
    @observable needToBindWechat = false;
    @observable sessionToken = '';
    @observable statusMessage = '';
    @observable nickName = '';

    @observable statusCode = null;
    @observable statusMsg = '';

    @observable jsCode = '';

    @action
    setSessionToken(sessionToken) {
      this.sessionToken = sessionToken;
    }

    @action
    setNickname(nickName) {
      this.nickName = nickName;
    }

    @action
    setStatusMessage(code, cause = '') {
      const causeMes = cause ? `，原因：${cause}` : '';
      this.statusCode = code;
      this.statusMsg = cause;
      this.statusMessage = `${USER_STATUS_MAP[code]}${causeMes}`;
      return this.statusMessage;
    }

    @action
    setJsCode(code) {
      this.jsCode = code;
    }
}
