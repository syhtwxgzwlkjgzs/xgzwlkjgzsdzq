import { observable, computed } from 'mobx';
import { get } from '../../utils/get';
import { defaultOperation } from '../../constants/const';
import { THREAD_TYPE } from '../../constants/thread-post';

class UserStore {
  constructor(props) {
    this.userInfo = props.userInfo ? props.userInfo : null;
  }

  @observable userInfo = null;
  @observable loginStatus = 'padding';
  @observable accessToken = null;
  @observable weixinNickName = null;
  @observable permissions = null;

  @observable userFans = {};
  @observable userFansPage = 1;
  @observable userFansTotalPage = 1;

  @observable userFollows = {};
  @observable userFollowsPage = 1;
  @observable userFollowsTotalPage = 1;

  @observable userThreads = [];
  @observable userThreadsPage = 1;
  @observable userThreadsTotalCount = 0;
  @observable userThreadsTotalPage = 1;

  @observable userLikes = [];
  @observable userLikesPage = 1;
  @observable userLikesTotalCount = 0;
  @observable userLikesTotalPage = 1;

  // 检索的目标用户，非自己
  @observable targetUser = null;

  // 检索的目标用户id
  @observable targetUserId = null;

  @observable targetUserFans = {};
  @observable targetUserFansPage = 1;
  @observable targetUserFansTotalPage = 1;

  @observable targetUserFollows = {};
  @observable targetUserFollowsPage = 1;
  @observable targetUserFollowsTotalPage = 1;


  @observable targetUserThreads = [];
  @observable targetUserThreadsPage = 1;
  @observable targetUserThreadsTotalCount = 0;
  @observable targetUserThreadsTotalPage = 1;

  @observable targetUserLikes = [];
  @observable targetUserLikesPage = 1;
  @observable targetUserLikesTotalCount = 0;
  @observable targetUserLikesTotalPage = 1;

  // 是否能使用钱包支付
  @computed get canWalletPay() {
    return get(this.userInfo, 'canWalletPay');
  }

  @computed get id() {
    return get(this.userInfo, 'id');
  }

  // 关注数
  @computed get followCount() {
    return get(this.userInfo, 'followCount');
  }

  // 粉丝数
  @computed get fansCount() {
    return get(this.userInfo, 'fansCount');
  }

  // 点赞数
  @computed get likedCount() {
    return get(this.userInfo, 'likedCount');
  }

  // 用户名称
  @computed get username() {
    return get(this.userInfo, 'username');
  }

  // 微信昵称
  @computed get nickname() {
    return get(this.userInfo, 'nickname');
  }

  // 背景图地址
  @computed get backgroundUrl() {
    return get(this.userInfo, 'backgroundUrl');
  }

  // 用户签名
  @computed get signature() {
    return get(this.userInfo, 'signature');
  }

  // 用户头像
  @computed get avatarUrl() {
    return get(this.userInfo, 'avatarUrl');
  }

  // 用户手机号
  @computed get mobile() {
    return get(this.userInfo, 'mobile');
  }

  // 获取绑定微信内容
  @computed get unionid() {
    return get(this.userInfo, 'unionid');
  }

  // 获取用户的用户组
  @computed get group() {
    return get(this.userInfo, 'group');
  }


  // 目标用户关注数
  @computed get targetUserFollowCount() {
    return get(this.targetUser, 'followCount');
  }

  // 目标用户粉丝数
  @computed get targetUserFansCount() {
    return get(this.targetUser, 'fansCount');
  }

  // 目标用户点赞数
  @computed get targetUserLikedCount() {
    return get(this.targetUser, 'likedCount');
  }

  // 目标用户名称
  @computed get targetUserUsername() {
    return get(this.targetUser, 'username');
  }

  // 目标用户微信昵称
  @computed get targetUserNickname() {
    return get(this.targetUser, 'nickname');
  }

  // 目标用户背景图地址
  @computed get targetUserBackgroundUrl() {
    return get(this.targetUser, 'backgroundUrl');
  }

  // 目标用户签名
  @computed get targetUserSignature() {
    return get(this.targetUser, 'signature');
  }

  // 目标用户头像
  @computed get targetUserAvatarUrl() {
    return get(this.targetUser, 'avatarUrl');
  }

  // 目标用户手机号
  @computed get targetUserMobile() {
    return get(this.targetUser, 'mobile');
  }

  // 目标用户被屏蔽状态
  @computed get targetUserDenyStatus() {
    return get(this.targetUser, 'isDeny');
  }


  // 发帖扩展的权限
  @computed get threadExtendPermissions() {
    const { permissions: pm } = this;

    return {
      [defaultOperation.emoji]: true,
      [defaultOperation.at]: true,
      [defaultOperation.topic]: true,
      [defaultOperation.attach]: get(pm, 'insertDoc.enable'),
      [defaultOperation.pay]: get(pm, 'insertPay.enable'),
      [defaultOperation.redpacket]: get(pm, 'insertRedPacket.enable'),
      [THREAD_TYPE.image]: get(pm, 'insertImage.enable'),
      [THREAD_TYPE.video]: get(pm, 'insertVideo.enable'),
      [THREAD_TYPE.voice]: get(pm, 'insertAudio.enable'),
      [THREAD_TYPE.goods]: get(pm, 'insertGoods.enable'),
      [THREAD_TYPE.reward]: get(pm, 'insertReward.enable'),
      createThread: get(pm, 'createThread.enable'),
    };
  }
}

export default UserStore;
