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
 * 附件类型，上传的时候需要传递的 type
 */
export const ATTACHMENT_TYPE = {
  file: 0, // 附件
  image: 1, // 图片
  audio: 2, // 语音
  video: 3, // 视频
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
  vote: 108, // 投票
  queue: 109, // 排队接龙
  file: 110, // 附件
  qaImage: 111, // 问答图片
};
