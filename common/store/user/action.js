import { action } from 'mobx';
import SiteStore from './store';
import {readUser} from '@server';

class UserAction extends SiteStore {
  constructor(props) {
    super(props);
  }

  // 写入用户数据
  @action
  setUserInfo(data) {
    this.userInfo = data;
    if (data && data.id) {
      this.updateLoginStatus(true);
    } else {
      this.updateLoginStatus(false);
    }
  }

  // 登录后获取新的用户信息
  @action
  async updateUserInfo(id) {
    const userInfo = await readUser({params:{pid: id}});
    userInfo.data && this.setUserInfo(userInfo.data);
    return userInfo.code === 0 && userInfo.data;
  }

  // 更新是否没有用户数据状态
  @action
  updateLoginStatus(isLogin) {
    this.loginStatus = isLogin;
  }

  @action
  removeUserInfo() {
    this.userInfo = null;
    this.noUserInfo = false;
  }

  @action
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  // 判断用户是否登录
  @action
  isLogin() {
    return this.userInfo && this.userInfo.id;
  }
}

export default UserAction;
