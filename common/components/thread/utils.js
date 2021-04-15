import { createContext } from 'react';

export const ThreadCommonContext = createContext();

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
