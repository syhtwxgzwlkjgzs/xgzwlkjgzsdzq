import { observable, action } from 'mobx';
import { simpleRequest } from '@common/utils/simple-request';
export default class InviteStore {
  @observable inviteData = { };
  @observable inviteCode = null;

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
