import { action } from 'mobx';
import SiteStore from './store';
import {
  readUser,
  readPermissions,
  createFollow,
  deleteFollow,
  getUserFollow,
  getUserFans,
  readThreadList,
  denyUser,
  deleteDeny,
  updateAvatar,
  updateBackground,
  updateUsersUpdate,
  smsSend,
  smsRebind,
  smsVerify,
} from '@server';
import { get } from '../../utils/get';
import set from '../../utils/set';

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

  // 初始化编辑用用户信息
  @action
  initEditInfo() {
    this.editNickName = get(this.userInfo, 'nickname');
    this.editUserName = get(this.userInfo, 'username');
    this.editSignature = get(this.userInfo, 'signature');
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
    if (this.userFollowsPage <= this.userFollowsTotalPage) {
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
    this.userFans[this.userFansPage] = pageData;
    if (this.userFansPage <= this.userFansTotalPage) {
      this.userFansPage += 1;
    }
    this.userFans = { ...this.userFans };
  }

  @action
  getTargetUserFollow = async (id) => {
    const followsRes = await getUserFollow({
      params: {
        page: this.targetUserFollowsPage,
        perPage: 20,
        filter: {
          userId: id,
        },
      },
    });

    if (followsRes.code !== 0) {
      console.error(followsRes);
      return;
    }

    const pageData = get(followsRes, 'data.pageData', []);
    const totalPage = get(followsRes, 'data.totalPage', 1);
    this.targetUserFollowsTotalPage = totalPage;
    this.targetUserFollows[this.targetUserFollowsPage] = pageData;
    if (this.targetUserFollowsPage <= this.targetUserFollowsTotalPage) {
      this.targetUserFollowsPage += 1;
    }
    this.targetUserFollows = { ...this.targetUserFollows };
  }

  @action
  getTargetUserFans = async (id) => {
    const fansRes = await getUserFans({
      params: {
        page: this.targetUserFansPage,
        perPage: 20,
        filter: {
          userId: id,
        },
      },
    });

    if (fansRes.code !== 0) {
      console.error(fansRes);
      return;
    }

    const pageData = get(fansRes, 'data.pageData', []);
    const totalPage = get(fansRes, 'data.totalPage', 1);
    this.targetUserFansTotalPage = totalPage;
    this.targetUserFans[this.targetUserFansPage] = pageData;
    if (this.targetUserFansPage <= this.targetUserFansTotalPage) {
      this.targetUserFansPage += 1;
    }
    this.targetUserFans = { ...this.targetUserFans };
  }

  /**
   * 取消屏蔽指定 id 的用户
   * @param {*} id
   */
  @action
  async undenyUser(id) {
    const deleteDenyRes = await deleteDeny({
      data: {
        id,
      },
    });

    if (deleteDenyRes.code === 0) {
      return deleteDenyRes.data;
    }

    throw {
      Code: deleteDenyRes.code,
      Msg: deleteDenyRes.message,
    };
  }

  /**
   * 屏蔽指定  id 的用户
   * @param {*} id
   */
  @action
  async denyUser(id) {
    const denyUserRes = await denyUser({
      data: {
        id,
      },
    });

    if (denyUserRes.code === 0) {
      return denyUserRes.data;
    }

    throw {
      Code: denyUserRes.code,
      Msg: denyUserRes.message,
    };
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
  setTargetUserDenied() {
    set(this.targetUser, 'isDeny', true);
  }

  @action
  setTargetUserNotBeDenied() {
    set(this.targetUser, 'isDeny', false);
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

    if (this.userThreadsPage <= this.userThreadsTotalPage) {
      this.userThreadsPage += 1;
    }

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
        page: this.targetUserThreadsPage,
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

    if (this.targetUserThreadsPage <= this.targetUserThreadsTotalPage) {
      this.targetUserThreadsPage += 1;
    }

    return this.targetUserThreads;
  }

  /**
   * 上传新的头像
   */
  @action
  async updateAvatar(fileList) {
    const param = new FormData();
    param.append('avatar', fileList[0]);// 通过append向form对象添加数据
    param.append('pid', this.id);
    await updateAvatar({
      transformRequest: [function (data) {
        return data;
      }],
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: param,
    });
    await this.updateUserInfo(this.id);
  }

  /**
   * 上传新的背景图
   */
  @action
  async updateBackground(fileList) {
    const param = new FormData();
    param.append('background', fileList[0]);// 通过append向form对象添加数据
    await updateBackground({
      transformRequest: [function (data) {
        return data;
      }],
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: param,
    });
    await this.updateUserInfo(this.id);
  }

  // FIXME: 这里报接口参数错误
  /**
   * 更新新的用户信息
   */
  @action
  async updateEditedUserInfo() {
    const updateUserInfoRes = await updateUsersUpdate({
      data: {
        signature: this.editSignature,
        nickname: this.editNickName,
      },
    });

    if (updateUserInfoRes.code === 0) {
      return updateUserInfoRes.data;
    }

    throw {};
  }

  /**
   * 初次设置用户密码
   */
  @action
  async setUserPassword() {
    const setUserPasswordRes = await updateUsersUpdate({
      data: {
        newPassword: this.newPassword,
        passwordConfirmation: this.newPasswordRepeat,
      },
    });

    if (setUserPasswordRes.code === 0) {
      return setUserPasswordRes.data;
    }

    throw {};
  }

  /**
   * 重设用户密码
   */
  @action
  async resetUserPassword() {
    const resetUserPasswordRes = await updateUsersUpdate({
      data: {
        password: this.oldPassword,
        newPassword: this.newPassword,
        passwordConfirmation: this.newPasswordRepeat,
      },
    });

    if (resetUserPasswordRes.code === 0) {
      return resetUserPasswordRes.data;
    }

    throw {};
  }

  @action
  async sendSmsUpdateCode({
    mobile,
    captchaTicket,
    captchaRandStr,
  }) {
    const smsResp = await smsSend({
      timeout: 3000,
      data: {
        mobile,
        type: 'rebind',
        captchaTicket,
        captchaRandStr,
      },
    });

    if (smsResp.code === 0) {
      // 可以利用 interval 获取过期时间
      return smsResp.data;
    }

    throw {
      Code: smsResp.code,
      Message: smsResp.msg,
    };
  }

  @action
  async sendSmsVerifyCode({
    mobile,
    captchaTicket,
    captchaRandStr,
  }) {
    const smsResp = await smsSend({
      timeout: 3000,
      data: {
        mobile,
        type: 'verify',
        captchaTicket,
        captchaRandStr,
      },
    });

    if (smsResp.code === 0) {
      // 可以利用 interval 获取过期时间
      return smsResp.data;
    }

    throw {
      Code: smsResp.code,
      Message: smsResp.msg,
    };
  }

  @action
  async verifyOldMobile() {
    const smsVerifyRes = await smsVerify({
      data: {
        mobile: this.originalMobile,
        code: this.oldMobileVerifyCode,
      },
    });

    if (smsVerifyRes.code === 0) {
      return smsVerifyRes.data;
    }

    throw {};
  }

  @action
  async rebindMobile() {
    const smsRebindRes = await smsRebind({
      data: {
        mobile: this.newMobile,
        code: this.newMobileVerifyCode,
      },
    });

    if (smsRebindRes.code === 0) {
      return smsRebindRes.data;
    }

    throw {};
  }

  @action
  async getUserLikes(page = 1) {
    const userLikesList = await readThreadList({
      params: {
        page,
        filter: {
          complex: 2,
        },
      },
    });

    console.log(userLikesList);

    return userLikesList;
  }

  @action
  async getUserCollections(page = 1) {
    const userCollectionList = await readThreadList({
      params: {
        page,
        filter: {
          complex: 2,
        },
      },
    });

    console.log(userCollectionList);

    return userCollectionList;
  }

  /**
   * 我的屏蔽对应store函数
   */
  // 屏蔽
  @action
  async postShield() {
    
  }

  // 取消屏蔽
  @action
  async cancelShield() {

  }

  // 点击屏蔽后需要更新的数据
  @action
  async setUserBeShielded() {

  }

  // 点击取消屏蔽后需要更新的数据
  @action
  async setUserBeUnShielded() {
    
  }

  /**
   * 四个清理函数，清理用户和目标用户粉丝信息
   */
  @action
  cleanUserFans = () => {
    this.userFans = {};
    this.userFansPage = 1;
    this.userFansTotalPage = 1;
  }

  @action
  cleanUserFollows = () => {
    this.userFollows = {};
    this.userFollowsPage = 1;
    this.userFollowsTotalPage = 1;
  }

  @action
  cleanTargetUserThreads = () => {
    this.targetUserThreads = [];
    this.targetUserThreadsPage = 1;
    this.targetUserThreadsTotalCount = 0;
    this.targetUserThreadsTotalPage = 1;
  }

  @action
  cleanTargetUserFans = () => {
    this.targetUserFans = {};
    this.targetUserFansPage = 1;
    this.targetUserFansTotalPage = 1;
  }

  @action
  cleanTargetUserFollows = () => {
    this.targetUserFollows = {};
    this.targetUserFollowsPage = 1;
    this.targetUserFollowsTotalPage = 1;
  }
}

export default UserAction;
