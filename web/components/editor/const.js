import { THREAD_TYPE, ACCEPT_VIDEO_TYPES, ATTACHMENT_TYPE } from '@common/constants/thread-post';

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
    name: 'UserOutlined', // emoji
    active: '#2469f6',
    id: defaultOperation.emoji,
  },
  {
    name: 'MessageDoubleOutlined', // @
    active: 'red',
    id: defaultOperation.at,
  },
  {
    name: 'PauseOutlined', // #
    active: 'green',
    id: defaultOperation.topic,
  },
  {
    name: 'PaperClipOutlined', // 附件
    active: '#2469f6',
    id: defaultOperation.attach,
  },
  {
    name: 'MailOutlined', // 红包
    active: '#2469f6',
    id: defaultOperation.redpacket,
  },
  {
    name: 'DoubleRightOutlined', // 付费
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
    name: 'ShopOutlined',
    active: '#2469f6',
    type: THREAD_TYPE.goods,
  },
  {
    name: 'QuestionOutlined',
    active: '#2469f6',
    type: THREAD_TYPE.reward,
  },
];
