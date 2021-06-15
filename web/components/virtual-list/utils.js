
const typeHeight = {
  header: 70, // 头部
  title: 38, // 标题
  image: 300, // 图片
  goods: 100, // 商品
  redPacket: 216 + 16, // 红包
  reward: 216 + 16, // 悬赏
  video: 200, // 视频
  audio: 56 + 16, // 音频
  file: 70, // 附件
  shareLike: 48, // 分享点赞
  footer: 52, // 底部
};

// 获取不可变的类型高度
export const getImmutableTypeHeight = (data) => {
  let height = 0;

  height = height + typeHeight.header;
  height = height + typeHeight.footer;

  // 标题
  if (data.title) {
    height = height + typeHeight.title;
  }

  // 分享点赞
  if (data.likeReward?.postCount || data.likeReward?.shareCount || data.likeReward?.likePayCount) {
    height = height + typeHeight.shareLike;
  }

  const content = data.content;

  const values = Object.values(content?.indexes || {});
  values.forEach((item) => {
    const { tomId } = item;
    // 统一做一次字符串转换
    const conversionTomID = `${tomId}`;
    if (conversionTomID === '101' && item.body?.length) {
      // 图片
      height = height + typeHeight.image;
    } else if (conversionTomID === '102' && item.body) {
      // 音频
      height = height + typeHeight.audio;
    } else if (conversionTomID === '103' && item.body) {
      // 视频
      height = height + typeHeight.video;
    } else if (conversionTomID === '104' && item.body) {
      // 商品
      height = height + typeHeight.goods;
    } else if (conversionTomID === '105' && item.body?.length) {
      // 问答
      // height = height + typeHeight.reward;
    } else if (conversionTomID === '106' && item.body) {
      // 红包
      height = height + typeHeight.redPacket;
    } else if (conversionTomID === '107' && item.body) {
      // 悬赏
      height = height + typeHeight.reward;
    } else if (conversionTomID === '108' && item.body?.length) {
      // 附件
      height = height + (typeHeight.file * item.body.length);
    }
  });
  return height;
};
