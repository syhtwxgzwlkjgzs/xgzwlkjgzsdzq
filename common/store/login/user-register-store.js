import { observable, action } from 'mobx';
import { usernameRegister } from '@server';

export default class UserRegisterStore {
  @observable username = '';
  @observable password = '';
  @observable nickname = '';
  @observable passwordConfirmation = '';

  isPasswordSame() {
    return this.password === this.passwordConfirmation;
  }

  isInfoNotCpl() {
    return !this.username || !this.password || !this.nickname || !this.passwordConfirmation;
  }

  @action
  async register() {
    // 信息需要填写完整
    if (this.isInfoNotCpl()) {
      throw {
        Code: 'reg_0000',
        Message: '请填写完整信息',
      };
    }

    if (!this.isPasswordSame()) {
      throw {
        Code: 'reg_0001',
        Message: '两次输入的密码不一致'
      }
    }

    try {
      const registerResp = await usernameRegister({
        timeout: 3000,
        data: {
          username: this.username,
          password: this.password,
          nickname: this.nickname,
          passwordConfirmation: this.passwordConfirmation
        },
      });
      if (registerResp.code === 0) {
        return registerResp.data;
      }
      throw {
        Code: registerResp.code,
        Message: registerResp.msg,
      };
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        Code: 'reg_9999',
        Message: '网络错误',
        error,
      };
    }

  }
}
