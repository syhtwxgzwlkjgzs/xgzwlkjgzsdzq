import { observable, action } from 'mobx';
import { smsSend, smsLogin } from '@server';

export default class nicknameBindStore {
  @observable nickname = '';

  @action
  async bindNickname() {
      if (!this.nickname) {
          throw {}
      }
  }
}