import { THREAD_TYPE, ACCEPT_VIDEO_TYPES, ATTACHMENT_TYPE } from '@common/constants/thread-post';

export const defaultOperation = {
  emoji: 'emoji',
  at: 'at',
  topic: 'topic',
  attach: 'attach',
  redpacket: 'redpacket',
  pay: 'pay',
};

const activeColor = '#2469f6';

/**
 * 默认的操作栏 icon，TODO: 待更新
 */
export const defaultIcon = [
  {
    name: 'SmilingFaceOutlined', // emoji
    active: activeColor,
    id: defaultOperation.emoji,
  },
  {
    name: 'AtOutlined', // @
    active: activeColor,
    id: defaultOperation.at,
  },
  {
    name: 'SharpOutlined', // #
    active: activeColor,
    id: defaultOperation.topic,
  },
  {
    name: 'PaperClipOutlined', // 附件
    active: activeColor,
    id: defaultOperation.attach,
    type: THREAD_TYPE.file
  },
  {
    name: 'WalletOutlined', // 红包
    active: activeColor,
    id: defaultOperation.redpacket,
  },
  {
    name: 'DollarLOutlined', // 付费
    active: activeColor,
    id: defaultOperation.pay,
  },
];

export const attachIcon = [
  {
    name: 'PictureOutlinedBig',
    active: activeColor,
    type: THREAD_TYPE.image,
  },
  {
    name: 'VideoOutlined',
    active: activeColor,
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
    active: activeColor,
    type: THREAD_TYPE.voice,
  },
  {
    name: 'ShoppingCartOutlined',
    active: activeColor,
    type: THREAD_TYPE.goods,
  },
  {
    name: 'QuestionOutlined',
    active: activeColor,
    type: THREAD_TYPE.reward,
  },
];
