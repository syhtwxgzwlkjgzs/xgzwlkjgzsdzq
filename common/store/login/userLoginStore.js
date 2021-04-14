import { observable, action } from 'mobx';
import { usernameLogin } from '@server';

export default class UserLoginStore {
  @observable username = null;
  @observable password = null;

  @action
  async login() {
    if (!this.username || !this.password) {
      throw {
        Code: '0000',
        Message: '请填写完整信息',
      };
    }

    try {
      const loginResp = await usernameLogin({
        base: 'discuz-dev.dnspod.dev',
        data: {
          username: this.username,
          password: this.password,
        },
      });
      if (loginResp.Code === 0) {
        return loginResp.Data;
      }
      throw {
        Code: loginResp.Code,
        Message: loginResp.Message,
      };
    } catch (error) {
      throw {
        Code: '9999',
        Message: '网络错误',
        error,
      };
    }
  }
}
