/**
 * 创建帖子页面的 Store
 */
import { observable, computed } from 'mobx';
import { LOADING_TOTAL_TYPE } from '@common/constants/thread-post';
import { plus } from '@common/utils/calculate';

class ThreadPostStore {
  // 鼠标索引位置
  @observable cursorPosition = 0;
  /**
   * 表情列表
   */
  @observable emojis = [];
  /**
   * 商品信息
   */
  @observable product = {};
  /**
   * 推荐的话题列表，选择话题的时候需要
   */
  @observable topics = [];
  @observable topicTotalCount = 0;
  /**
   * 我的关注
   */
  @observable follows = [];
  @observable followsTotalCount = 0;
  /**
   * 加载状态
   */
  @observable loading = {
    [LOADING_TOTAL_TYPE.product]: false,
    [LOADING_TOTAL_TYPE.topic]: false,
    [LOADING_TOTAL_TYPE.emoji]: false,
    [LOADING_TOTAL_TYPE.follow]: false,
  };

  /**
   * 发帖相关数据
   */
  @observable postData = {
    title: '', // 标题
    categoryId: 0, // 分类id
    anonymous: 0, // 非匿名； 1 - 匿名。如果是 0 的时候不传
    draft: 0, // 非草稿：1 - 草稿。如果是 0 的时候不传
    price: 0, // 帖子价格 - 全贴付费。如果是 0 的时候不传
    attachmentPrice: 0, // 附件价格 - 帖子免费，附件收费。如果是 0 的时候不传
    freeWords: 1, // 百分比 0 - 1 之间；
    position: {}, // 定位信息。longtitude，latitude，address，location
    contentText: '', // 文本内容
    audio: {}, // 语音
    rewardQa: {}, // 悬赏问答 value-价格，times-悬赏结束时间
    product: {}, // 商品
    redpacket: {}, // 红包 rule-规则，price-金额，number-个数，condition-领取条件，likenum-点赞数
    video: {}, // 视频
    images: {}, // 图片
    files: {}, // 文件
    orderSn: '', // 支付订单号
    ticket: '', // 腾讯云验证码返回票据
    randstr: '', // 腾讯云验证码返回随机字符串
  }

  @computed get payTotalMoney() {
    return plus(this.postData.price, this.postData.attachmentPrice);
  }

  @observable
  categorySelected = { // 选中的帖子类别
    parent: {}, // 选中的帖子父类
    child: {}, // 选中的帖子子类
  };

  // 当前选择的工具栏
  @observable
  currentSelectedToolbar = false;

  @computed get redpacketTotalAmount() { // 计算红包总额
    const { rule = 1, price = 0, number } = this.postData.redpacket;
    return rule === 1
      ? parseFloat(price)
      : (parseFloat(price) * parseInt(number)).toFixed(2);
  }

  @observable
  navInfo = {
    statusBarHeight: 44, // 默认的状态栏高度
    navHeight: 40, // 默认的导航栏高度
    menubtnWidth: 80, // 胶囊按钮的宽度
  }
}

export default ThreadPostStore;
