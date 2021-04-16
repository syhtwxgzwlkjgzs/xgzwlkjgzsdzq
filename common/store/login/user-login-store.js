import { observable, action } from 'mobx';
import { usernameLogin } from '@server';
import { get } from '../../utils/get';
import setAccessToken from '../../utils/set-access-token';

export default class UserLoginStore {
  @observable username = '';
  @observable password = '';

  @action
  async login() {

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
        url: 'https://discuz3-dev.dnspod.dev/apiv3/users/username.login',
        data: {
          username: this.username,
          password: this.password,
        },
      });
      if (loginResp.code === 0) {
        const accessToken = get(loginResp, 'data.accessToken', '');
        // 种下 access_token
        setAccessToken({
          accessToken
        })
        return loginResp.data;
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
