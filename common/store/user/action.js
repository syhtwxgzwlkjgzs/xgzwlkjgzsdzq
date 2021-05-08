import { action } from 'mobx';
import SiteStore from './store';
import { readUser, readPermissions, createFollow, deleteFollow, getUserFollow, getUserFans } from '@server';

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

  // 写入用户发帖权限
  @action
  async setUserPermissions(data) {
    this.permissions = data;
  }

  // 登录后获取新的用户信息
  @action
  async updateUserInfo(id) {
    const userInfo = await readUser({ params: { pid: id } });
    const userPermissions = await readPermissions({});
    userInfo.data && this.setUserInfo(userInfo.data);
    userPermissions.data && this.setUserPermissions(userPermissions.data);
    return userInfo.code === 0 && userInfo.data;
  }

  // 获取指定用户的用户信息，用于获取他人首页
  @action
  async getTargetUserInfo(id) {
    this.targetUser = null;
    this.targetUserId = id;
    const userInfo = await this.getAssignUserInfo(id);
    this.targetUser = userInfo;
    return userInfo;
  }


  @action
  async getUserFollow() {
    const follows = await getUserFollow({});
    console.log(follows);
  }

  @action
  async getUserFans() {
    const fans = await getUserFans({});
    console.log(fans);
  }

  // 更新是否没有用户数据状态
  @action
  updateLoginStatus(isLogin) {
    this.loginStatus = isLogin;
  }

  @action
  removeUserInfo() {
    this.userInfo = null;
    this.permissions = null;
    this.noUserInfo = false;
  }

  @action
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  // 判断用户是否登录
  @action
  isLogin() {
    return !!this.userInfo && !!this.userInfo.id;
  }

  // 获取指定用户信息
  @action
  async getAssignUserInfo(userId) {
    try {
      const userInfo = await readUser({ params: { pid: userId } });
      if (userInfo.code === 0 && userInfo.data) {
        return userInfo.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * 关注
   * @param {object} userId * 被关注人id
   * @returns {object} 处理结果
   */
    @action
  async postFollow(userId) {
    const res = await createFollow({ data: {  toUserId: userId } });
    if (res.code === 0 && res.data) {
      return {
        msg: '操作成功',
        data: res.data,
        success: true,
      };
    }
    return {
      msg: res.msg,
      data: null,
      success: false,
    };
  }

    /**
     * 取消关注
     * @param {object} search * 搜索值
     * @returns {object} 处理结果
     */
    @action
    async cancelFollow({ id, type }) {
      const res = await deleteFollow({ data: { id, type } });
      if (res.code === 0 && res.data) {
        return {
          msg: '操作成功',
          data: res.data,
          success: true,
        };
      }
      return {
        msg: res.msg,
        data: null,
        success: false,
      };
    }
}

export default UserAction;
