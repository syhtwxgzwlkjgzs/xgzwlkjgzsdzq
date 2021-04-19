import React from 'react';
import styles from './index.module.scss';
import { Audio } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 语音
 * @prop {POST_TYPE} type 类型 0：未付费 1：已付费
 * @prop {string | number} money 付费金额
 * @prop {string} url 音频地址
 * @prop {function} goCheckAudio 音频点击事件
 */

const Index = ({type = POST_TYPE.PAID, url, goCheckAudio = noop}) => {
  const onPlay = () => {
    console.log('正在播放');
  };
  return (
    <div className={styles.container}>
      <Audio src={url} onPlay={onPlay} />
      {/* 音频蒙层 已付费时隐藏 未付费时显示 */}
      {
        type === POST_TYPE.UNPAID &&
        <div className={styles.payBox} onClick={goCheckAudio}></div>
      }
    </div>
  ); 
};
export const POST_TYPE = {
  UNPAID: 0,
  PAID: 1,
};

export default React.memo(Index);
