import { THREAD_TYPE, ACCEPT_VIDEO_TYPES, ATTACHMENT_TYPE } from '@common/constants/thread-post';

/**
 * 默认的操作栏 icon，TODO: 待更新
 */
export const defaultIcon = [
  {
    name: 'UserOutlined', // emoji
    active: '#2469f6',
    id: 'emoji',
  },
  {
    name: 'MessageDoubleOutlined', // @
    active: 'red',
  },
  {
    name: 'PauseOutlined', // #
    active: 'green',
  },
  {
    name: 'PaperClipOutlined', // 附件
    active: '#2469f6',
  },
  {
    name: 'MailOutlined', // 红包
    active: '#2469f6',
  },
  {
    name: 'DoubleRightOutlined', // 付费
    active: '#2469f6',
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
