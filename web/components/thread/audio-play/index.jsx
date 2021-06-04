import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';
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

const Index = ({ isPay = false, url, onPay = noop, baselayout }) => {

  const audioRef = useRef();
  const audioWrapperRef = useRef();

  const onPlay = () => {
    const audioContext = audioRef?.current?.getState()?.audioCtx;
    if(audioContext && baselayout && audioRef && audioWrapperRef) {
      // 音频在帖子中间，要找到音频相对于BaseLayout的具体地址
      const positionInThread = audioWrapperRef?.current?.parentNode?.offsetTop || 0;
      const threadTextHeight = audioWrapperRef?.current?.parentNode?.parentNode?.previousElementSibling?.offsetHeight || 0;
      const userInfoHeight = audioWrapperRef?.current?.parentNode?.parentNode?.parentNode?.previousElementSibling?.offsetHeight || 0;
      const threadPosition = audioWrapperRef?.current?.parentNode?.parentNode?.parentNode?.parentNode?.offsetTop || 0;
      const position = positionInThread + threadTextHeight + threadPosition + userInfoHeight;

      // 暂停之前正在播放的音视频
      baselayout.pauseWebAllPlayers();
      baselayout.playingAudioPos = position > 0 ? position : -1;
      baselayout.playingAudioDom = audioContext;
    }

  };

  return (
    <div className={styles.container}>
      {
        isPay ? (
          <div className={styles.wrapper}>
            <img src='/dzq-img/pay-audio.png' className={styles.payBox} onClick={onPay}></img>
          </div>
        ) : <div ref={audioWrapperRef}><Audio src={url} onPlay={onPlay} disabled={!url} ref={audioRef}/></div>
      }
    </div>
  );
};

export default inject('baselayout')(observer(Index));
