import { THREAD_TYPE, ACCEPT_VIDEO_TYPES, ATTACHMENT_TYPE } from '@common/constants/thread-post';

// 商品链接分析页的图标
export const goodImages = [
  {
    src: '/dzq-img/jingdong.svg',
    name: '京东',
    width: 20,
    height: 20,
  },
  {
    src: '/dzq-img/taobao.svg',
    name: '淘宝',
    width: 20,
    height: 20,
  },
  {
    src: '/dzq-img/tmall.svg',
    name: '天猫',
    width: 20,
    height: 20,
  },
  {
    src: '/dzq-img/pinduoduo.svg',
    name: '拼多多',
    width: 20,
    height: 20,
  },
  {
    src: '/dzq-img/youzan.svg',
    name: '有赞',
    width: 20,
    height: 20,
  },
];

export const defaultOperation = {
  emoji: 'emoji',
  at: 'at',
  topic: 'topic',
  attach: 'attach',
  redpacket: 'redpacket',
  pay: 'pay',
};

/**
 * 默认的操作栏 icon，TODO: 待更新
 */
export const defaultIcon = [
  {
    name: 'SmilingFaceOutlined', // emoji
    active: '#2469f6',
    id: defaultOperation.emoji,
  },
  {
    name: 'AtOutlined', // @
    active: 'red',
    id: defaultOperation.at,
  },
  {
    name: 'SharpOutlined', // #
    active: 'green',
    id: defaultOperation.topic,
  },
  {
    name: 'PaperClipOutlined', // 附件
    active: '#2469f6',
    id: defaultOperation.attach,
    type: THREAD_TYPE.file
  },
  {
    name: 'WalletOutlined', // 红包
    active: '#2469f6',
    id: defaultOperation.redpacket,
  },
  {
    name: 'DollarLOutlined', // 付费
    active: '#2469f6',
    id: defaultOperation.pay,
  },
];

// TODO: icon 待更换
export const attachIcon = [
  {
    name: 'PictureOutlinedBig',
    active: '#2469f6',
    type: THREAD_TYPE.image,
  },
  {
    name: 'VideoOutlined',
    active: 'red',
    type: THREAD_TYPE.video,
    isUpload: true,
    limit: 1,
    accept: ACCEPT_VIDEO_TYPES.join(','),
    data: {
      type: ATTACHMENT_TYPE.video,
    },
  },
  {
    name: 'MicroOutlined',
    active: 'green',
    type: THREAD_TYPE.voice,
  },
  {
    name: 'ShoppingCartOutlined',
    active: '#2469f6',
    type: THREAD_TYPE.goods,
  },
  {
    name: 'QuestionOutlined',
    active: '#2469f6',
    type: THREAD_TYPE.reward,
  },
];
