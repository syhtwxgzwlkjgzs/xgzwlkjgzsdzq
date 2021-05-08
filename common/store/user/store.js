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

  // 检索的目标用户，非自己
  @observable targetUser = null;

  // 检索的目标用户id
  @observable targetUserId = null;


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
