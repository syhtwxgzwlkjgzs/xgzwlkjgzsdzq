import { observable, action } from 'mobx';
import { simpleRequest } from '@common/utils/simple-request';
import { get } from '../../utils/get';
export default class InviteStore {
  @observable inviteData = { };
  @observable inviteCode = '';

  @action getInviteCode(router) {
    return this.inviteCode || wx?.getStorage('inviteCode') || window?.sessionStorage?.getItem('inviteCode') || router?.query?.inviteCode || '';
  }

  @action setInviteCode(code) {
    this.inviteCode = code;

    wx?.setStorage('inviteCode', code)
    window?.sessionStorage?.setItem('inviteCode', code);
    // storage?.setItem('inviteCode', code)
  }

  @action
  async getInviteUsersList() {
    const res = await simpleRequest('inviteUsersList', {
      timeout: 3000,
    });
    this.inviteData = res.pageData;
  }

  @action
  async createInviteLink() {
    const res = await simpleRequest('createInviteLink', {
      timeout: 3000,
    });
    this.inviteCode = res.code;
  }
}
