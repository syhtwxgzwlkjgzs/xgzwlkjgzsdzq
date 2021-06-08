import { observable, computed, action } from 'mobx';
import { simpleRequest } from '@common/utils/simple-request';
import { get } from '@common/utils/get';
import isWeiXin from '../../utils/is-weixin';
export default class InviteStore {
  @observable inviteData = { };
  @observable inviteUsersList = null;
  @observable inviteCode = '';
  @observable inviteLoading = true;
  @observable totalPage = 0;
  @observable currentPage = 0;

  @computed get isNoData () {
    return this.currentPage >= this.totalPage;
  }

  @action setInviteLoading (loading) {
    this.inviteLoading = loading;
  }

  @action getInviteCode(router) {
    let inviteCode;
    if (typeof window === 'object') {
      console.log('invite coee');
      console.log(router.query.inviteCode);
      inviteCode = this.inviteCode || window?.sessionStorage?.getItem('inviteCode') || router?.query?.inviteCode || '';
    }
    return inviteCode;
  }

  @action setInviteCode(code) {
    this.inviteCode = code;
    typeof window === 'object' && window.sessionStorage?.setItem('inviteCode', code);
  }


  @action
  async getInviteUsersList(page = 1) {
    this.inviteLoading = true;
    const res = await simpleRequest('inviteUsersList', {
      params: {
        page,
      },
    });
    this.inviteData = res.pageData;
    this.totalPage = res.totalPage;
    this.currentPage = res.currentPage;
    this.inviteLoading = false;
    const listData = get(res, 'pageData.inviteUsersList', null);
    this.inviteUsersList = this.inviteUsersList?.concat(listData) || listData;
  }

  @action
  async createInviteLink() {
    const res = await simpleRequest('createInviteLink', {

    });
    this.inviteCode = res.code;
  }
}
