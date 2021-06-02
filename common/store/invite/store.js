import { observable, action } from 'mobx';
import { simpleRequest } from '@common/utils/simple-request';
import isWeiXin from '../../utils/is-weixin';
export default class InviteStore {
  @observable inviteData = { };
  @observable inviteCode = '';

  @action getInviteCode(router) {
    let inviteCode;
    if (typeof wx === 'object') {
      wx.getStorage && (inviteCode = wx?.getStorage('inviteCode'));
    }
    if (typeof window === 'object') {
      inviteCode = inviteCode || window?.sessionStorage?.getItem('inviteCode') || router?.query?.inviteCode || '';
    }
    return inviteCode || this.inviteCode;
  }

  @action setInviteCode(code) {
    this.inviteCode = code;
      typeof wx === 'object' && wx.getStorage && wx.setStorage('inviteCode', code);
      typeof window === 'object' && window.sessionStorage?.setItem('inviteCode', code);
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
