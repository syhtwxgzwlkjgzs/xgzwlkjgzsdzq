import { observable, action } from 'mobx';
import { usernameLogin } from '@server';
import { get } from '../../utils/get';
import setAccessToken from '../../utils/set-access-token';
import { BAND_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/common-login-store';

export const NEED_BIND_WEIXIN_FLAG = 8000;
export const NEED_BIND_PHONE_FLAG = 8001;

export default class UserLoginStore {
  @observable username = '';
  @observable password = '';

  /**
   * 检查用户是否处于审核状态，用来跳转状态页面
   * @param {*} smsLoginResp
   */
  checkUserStatus = (smsLoginResp) => {
    const rejectReason = get(smsLoginResp, 'data.rejectReason', '');
    const status = get(smsLoginResp, 'data.userStatus', 0);
    if (status ===  REVIEWING) {
      throw {
        Code: status,
        Message: rejectReason,
      };
    }
    return;
  }


  @action
  login = async () => {
    // 信息需要填写完整
    if (!this.username || !this.password) {
      throw {
        Code: 'ulg_0000',
        Message: '请填写完整信息',
      };
    }

    try {
      const loginResp = await usernameLogin({
        timeout: 3000,
        url: 'https://discuzv3-dev.dnspod.dev/apiv3/users/username.login',
        data: {
          username: this.username,
          password: this.password,
          type: 'mobilebrowser_username_login',
        },
      });

      if (loginResp.code === 0
          || loginResp.code === NEED_BIND_WEIXIN_FLAG) {
        const accessToken = get(loginResp, 'data.accessToken', '');
        // 种下 access_token
        setAccessToken({
          accessToken,
        });
        this.checkUserStatus(loginResp);
      }

      if (loginResp.code === 0) {
        return loginResp.data;
      }

      if (loginResp.code === NEED_BIND_PHONE_FLAG) {
        throw {
          Code: NEED_BIND_PHONE_FLAG,
          sessionToken: get(loginResp, 'data.sessionToken'),
          Message: '需要绑定手机号',
        };
      }

      if (loginResp.code === NEED_BIND_WEIXIN_FLAG) {
        throw {
          Code: 8000,
          Message: '需要绑定微信',
          sessionToken: get(loginResp, 'data.sessionToken'),
        };
      }

      if (loginResp.code === BAND_USER || loginResp.code === REVIEW_REJECT) {
        throw {
          Code: loginResp.code,
          Message: get(loginResp, 'Data.rejectReason', ''),
        };
      }

      throw {
        Code: loginResp.code,
        Message: loginResp.msg,
      };
    } catch (error) {
      if (error.Code) {
        throw error;
      }

      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }
}
