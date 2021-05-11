import { action } from 'mobx';
import SiteStore from './store';
import { readUser, readPermissions, createFollow, deleteFollow, getUserFollow, getUserFans, readThreadList, denyUser } from '@server';
import { get } from '../../utils/get';

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
  getUserFollow = async () => {
    const followsRes = await getUserFollow({
      params: {
        page: this.userFollowsPage,
        perPage: 20,
      },
    });

    if (followsRes.code !== 0) {
      console.error(followsRes);
      return;
    }

    const pageData = get(followsRes, 'data.pageData', []);
    const totalPage = get(followsRes, 'data.totalPage', 1);
    this.userFollowsTotalPage = totalPage;
    this.userFollows[this.userFollowsPage] = pageData;
    if (this.userFollowsPage < this.userFollowsTotalPage) {
      this.userFollowsPage += 1;
    }
    this.userFollows = { ...this.userFollows };
  }

  @action
  getUserFans = async () => {
    const fansRes = await getUserFans({
      params: {
        page: this.userFansPage,
        perPage: 20,
      },
    });

    if (fansRes.code !== 0) {
      console.error(fansRes);
      return;
    }

    const pageData = get(fansRes, 'data.pageData', []);
    const totalPage = get(fansRes, 'data.totalPage', 1);
    this.userFans[this.userFansPage] = pageData;
    this.userFansTotalPage = totalPage;
    this.userFollows[this.userFansPage] = pageData;
    if (this.userFansPage < this.userFansTotalPage) {
      this.userFansPage += 1;
    }
    this.userFollows = { ...this.userFollows };
  }

  /**
   * 取消屏蔽指定 id 的用户s
   * @param {*} id
   */
  @action
  async undenyUser(id) {
    await denyUser({
      data: {},
    });
  }

  /**
   * 屏蔽指定  id 的用户
   * @param {*} id
   */
  @action
  async denyUser(id) {
    await denyUser({
      data: {},
    });
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

  @action
  async setUserFollowerBeFollowed(id) {
    Object.keys(this.userFollows).forEach((key) => {
      this.userFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isUnFollowed = false;
      });
    });
  }

  @action
  async setUserFollowerBeUnFollowed(id) {
    Object.keys(this.userFollows).forEach((key) => {
      this.userFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isUnFollowed = true;
      });
    });
  }

  @action
  async setUserFansBeFollowed(id) {
    Object.keys(this.userFans).forEach((key) => {
      this.userFans[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isMutual = true;
      });
    });
  }

  @action
  async setUserFansBeUnFollowed(id) {
    Object.keys(this.userFans).forEach((key) => {
      this.userFans[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isMutual = false;
      });
    });
  }

  @action
  async setTargetUserFollowerBeFollowed(id) {
    Object.keys(this.targetUserFollows).forEach((key) => {
      this.targetUserFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isUnFollowed = false;
      });
    });
  }

  @action
  async setTargetUserFollowerBeUnFollowed(id) {
    Object.keys(this.targetUserFollows).forEach((key) => {
      this.targetUserFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isUnFollowed = true;
      });
    });
  }

  @action
  async setTargetUserFansBeFollowed(id) {
    Object.keys(this.targetUserFans).forEach((key) => {
      this.targetUserFans[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isMutual = true;
      });
    });
  }

  @action
  async setTargetUserFansBeUnFollowed(id) {
    Object.keys(this.targetUserFans).forEach((key) => {
      this.targetUserFans[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isMutual = false;
      });
    });
  }

  /**
   * 关注
   * @param {object} userId * 被关注人id
   * @returns {object} 处理结果
   */
  @action
  async postFollow(userId) {
    const res = await createFollow({ data: { toUserId: userId } });
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

  /**
   * 获取用户自己发的主题列表
   * @returns
   */
  @action
  getUserThreads = async () => {
    const userThreadList = await readThreadList({
      params: {
        page: this.userThreadsPage,
        filter: {
          toUserId: 0,
          complex: 5,
        },
      },
    });
    const pageData = get(userThreadList, 'data.pageData', []);
    const totalPage = get(userThreadList, 'data.totalPage', 1);
    this.userThreadsTotalPage = totalPage;
    this.userThreads = [...this.userThreads, ...pageData];
    this.userThreadsTotalCount = get(userThreadList, 'data.totalCount', 0);

    return this.userThreads;
  }


  /**
   * 获取指定用户发的主题列表
   * @param {*} id
   * @returns
   */
  @action
  async getTargetUserThreads(id) {
    const targetUserThreadList = await readThreadList({
      params: {
        page: this.targetUsersPage,
        filter: {
          toUserId: id,
          complex: 5,
        },
      },
    });

    const pageData = get(targetUserThreadList, 'data.pageData', []);
    const totalPage = get(targetUserThreadList, 'data.totalPage', 1);
    this.targetUserThreadsTotalPage = totalPage;
    this.targetUserThreads = [...this.targetUserThreads, ...pageData];
    this.targetUserThreadsTotalCount = get(targetUserThreadList, 'data.totalCount', 0);

    return this.targetUserThreads;
  }


  /**
   * 获取用户喜欢列表
   */
  @action
  async getUserLikeLists() {

  }

  /**
   * 获取指定用户喜欢列表
   */
  @action
  async getTargetUserLikeLists() {

  }
}

export default UserAction;
