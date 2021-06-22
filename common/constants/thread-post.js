export const MAX_COUNT = 50000;
/**
 * 加载或者总数对应的类型
 */
export const LOADING_TOTAL_TYPE = {
  product: 'product',
  follow: 'follow',
  emoji: 'emoji',
  topic: 'topic',
};

/**
 * 上传视频音频类型
 */
export const CREATE_VA = {
  video: 0,
  audio: 1,
};

/**
 * 附件类型，上传的时候需要传递的 type
 */
export const ATTACHMENT_TYPE = {
  file: 0, // 附件
  image: 1, // 图片
  audio: 1, // 语音
  video: 1, // 视频
  message: 4, // 消息图片
  answer: 5, // 文档图片
};

/**
 * 帖子类型
 */
export const THREAD_TYPE = {
  text: 100, // 文本 【暂时不用】
  image: 101, // 图片
  voice: 102, // 语音
  video: 103, // 视频
  goods: 104, // 商品
  qa: 105, // 问答
  redPacket: 106, // 红包
  reward: 107, // 悬赏
  // vote: 108, // 投票
  // queue: 109, // 排队接龙
  file: 108, // 附件
  emoji: 109, // 小表情
  // qaImage: 111, // 问答图片
  paid: 112, // 插入付费
  paidPost: 113, // 支付主题
  paidAttachment: 114, // 支付附件
  at: 115, // @用户
  topic: 116, // 话题
  draft: 117, // 草稿
  saveDraft: 118, // 保存草稿
  abandonDraft: 119, // 不保存草稿
  anonymity: 10001, // 匿名
};

// 图片类型
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
export const ACCEPT_IMAGE_TYPES = [
  'image/*',
];

export const ACCEPT_VIDEO_TYPES = [
  'video/mp4',
  'video/x-m4v',
  'video/*',
];

// 附件类型
export const ACCEPT_FILE_TYPES = [
  '*/*',
];
