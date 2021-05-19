import React from 'react';
import styles from './index.module.scss';
import { Audio } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 语音
 * @prop {boolean} isPay 是否需要付费
 * @prop {string | number} money 付费金额
 * @prop {string} url 音频地址
 * @prop {function} goCheckAudio 音频点击事件
 */

const Index = ({ isPay = false, url, onPay = noop }) => {
  const onPlay = () => {
    console.log('正在播放');
  };
  return (
    <div className={styles.container}>
      {
        isPay ? (
          <div className={styles.wrapper}>
            <img src='/dzq-img/pay-audio.png' className={styles.payBox} onClick={onPay}></img>
          </div>
        ) : <Audio src={url} onPlay={onPlay} disabled={!url} />
      }
    </div>
  );
};

export default React.memo(Index);
