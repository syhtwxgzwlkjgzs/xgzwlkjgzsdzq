import { observable, action } from 'mobx';
import { usernameLogin } from '@server';
import { get } from '../../utils/get';
import setAccessToken from '../../utils/set-access-token';
import { checkUserStatus } from '@common/store/login/util';


export const NEED_BIND_WEIXIN_FLAG = 8000;
export const NEED_BIND_PHONE_FLAG = 8001;

export default class UserLoginStore {
  @observable username = '';
  @observable password = '';
  @observable sessionToken = '';

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
      const data =  {
        username: this.username,
        password: this.password,
        type: 'mobilebrowser_username_login',
      };

      if (this.sessionToken) {
        data.sessionToken = this.sessionToken;
      }
      const loginResp = await usernameLogin({
        timeout: 3000,
        data,
      });
      checkUserStatus(loginResp);

      if (loginResp.code === 0
          || loginResp.code === NEED_BIND_WEIXIN_FLAG) {
        const accessToken = get(loginResp, 'data.accessToken', '');
        // 种下 access_token
        setAccessToken({
          accessToken,
        });
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
          nickname: get(loginResp, 'data.nickname'),
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
