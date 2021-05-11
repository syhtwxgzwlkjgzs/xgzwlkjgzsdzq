import { observable, action } from 'mobx';
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
    @observable needToBindMini = false;
    @observable sessionToken = '';
    @observable statusMessage = '';
    @observable nickName = '';

    @observable statusCode = null;
    @observable statusMsg = '';

    @observable jsCode = '';


    @observable captcha = null;

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

    @action
    toTCaptcha = async ({appid, resCallback, quitCallback}) => {
      // 验证码实例为空，则创建实例
      if (!this.captcha) {
        const TencentCaptcha = (await import('@common/utils/tcaptcha')).default;
        this.captcha = new TencentCaptcha(appid, (res) => {
          if (res.ret === 0) {
            // 验证通过后发布
            resCallback();
          }
          if (res.ret === 2) {
            quitCallback();
          }
        });
      }
      // 显示验证码
      this.captcha.show();
    }
}
