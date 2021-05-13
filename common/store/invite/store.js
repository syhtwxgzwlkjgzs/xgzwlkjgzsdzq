import { observable, action } from 'mobx';
import { inviteUsersList, createInviteLink } from '@server';
export default class InviteStore {
  @observable inviteData = { };
  @observable inviteLink = null;

  @action
  async getInviteUsersList(opts) {
    try {
      const res = await inviteUsersList({
        timeout: 3000,
        ...opts,
      });
      if (res.code === 0) {
        console.log(res.data);
        this.inviteData = res.data.pageData;
        return;
      }
      throw {
        Code: res.code,
        Message: res.msg,
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

  @action
  async createInviteLink() {
    try {
      const res = await createInviteLink({
        timeout: 3000,
      });
      if (res.code === 0) {
        this.inviteLink = res.data.code;
        return;
      }
      throw {
        Code: res.code,
        Message: res.msg,
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
