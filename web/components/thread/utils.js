import { createContext } from 'react';
import { updatePosts, createThreadShare } from '@server';


export const ThreadCommonContext = createContext();

export const noop = () => {};

// 过滤点击事件
export const filterClickClassName = (dom) => {
  const blacklistClass = ['dzq-popup__overlay', 'dzq-audio', 'dzq-avatar', 'dzq-tabs'];
  const blacklistHTML = ['img'];
  // const whitelist = [];
  const { className = '', localName = '' } = dom;
  const blacklistFilter = blacklistClass.filter(item => className.indexOf(item) !== -1);
  if (blacklistFilter.length || blacklistHTML.indexOf(localName) !== -1) {
    return false;
  }
  return true;
};

// 处理附件的数据
export const handleAttachmentData = (data) => {
  const newData = { text: data.text };
  const values = Object.values(data.indexes || {});
  values.forEach((item) => {
    const { tomId } = item;
    if (tomId === '101') { // 图片
      newData.imageData = item.body;
    } else if (tomId === '102') { // 音频
      newData.audioData = item.body;
    } else if (tomId === '103') { // 视频
      newData.videoData = item.body;
    } else if (tomId === '104') { // 商品
      newData.goodsData = item.body;
    } else if (tomId === '105') { // 问答
      newData.qaData = item.body;
    } else if (tomId === '106') { // 红包
      newData.redPacketData = item.body;
    } else if (tomId === '107') { // 悬赏
      newData.rewardData = item.body;
    } else if (tomId === '108') { // 附件
      newData.fileData = item.body;
    }
  });

  return newData;
};

export const extensionList = [
  '7Z',
  'AI', 'APK',
  'CAD', 'CDR',
  'DOC', 'DOCX',
  'EPS', 'EXE', 'IPA',
  'MP3', 'MP4', 'PDF', 'PPT', 'PSD', 'RAR', 'TXT', 'XLS', 'XLSX', 'ZIP', 'JPG', 'WAV',
];

/* dispatch 类型常量 */
export const ON_LIKE = 'ON_LIKE'; // 点赞事件
export const ON_SHARE = 'ON_LIKE'; // 分享事件
export const ON_COMMENT = 'ON_COMMENT'; // 评论事件
export const ON_PAY_VIDEO = 'ON_PAY_VIDEO'; // 视频付费事件
export const ON_PAY_AUDIO = 'ON_PAY_AUDIO'; // 音频付费事件
export const ON_PAY_REWARD = 'ON_PAY_REWARD'; // 悬赏付费事件
export const ON_PAY_ATTACHMENT = 'ON_PAY_ATTACHMENT'; // 附件付费事件
export const ON_PAY_CONTENT = 'ON_PAY_CONTENT'; // 文字付费事件
export const ON_PAY_IMAGE = 'ON_PAY_IMAGE'; // 图片付费事件

// 点赞
export const updateThreadInfo = async ({ pid, id, data: att } = {}) => {
  const res = await updatePosts({ data: { pid, id, data: att } });
  console.log('点赞接口调用成功', res);
};


// 分享
export const updateThreadShare = async ({ threadId } = {}) => {
  const res = await createThreadShare({ data: { threadId } });
  console.log('分享接口调用成功', res);
};
