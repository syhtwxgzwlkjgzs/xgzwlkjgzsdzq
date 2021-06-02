import { observable, action } from 'mobx';
import { simpleRequest } from '@common/utils/simple-request';
import { get } from '../../utils/get';
import isWeiXin from '../../utils/is-wechat-browser';
export default class InviteStore {
  @observable inviteData = { };
  @observable inviteCode = '';

  @action getInviteCode(router) {
    let inviteCode;
    if (isWeiXin()) {
      inviteCode = wx.getStorage('inviteCode');
    } else {
      inviteCode = window?.sessionStorage?.getItem('inviteCode') || router?.query?.inviteCode || '';
    }

    return inviteCode || this.inviteCode;
  }

  @action setInviteCode(code) {
    this.inviteCode = code;
    if (isWeiXin()) {
      wx.setStorage('inviteCode', code);
    } else {
      window?.sessionStorage?.setItem('inviteCode', code);
    }
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
