import React from 'react';
import styles from './index.module.scss';
import Audio from '@discuzq/design/dist/components/audio/index';
import { noop } from '../utils';
import { View, Image } from '@tarojs/components'
import parAudioImg from '../../../../../web/public/dzq-img/pay-audio.png';

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
    <View className={styles.container}>
      {
        isPay ? (
          <View className={styles.wrapper}>
            <Image src={parAudioImg} className={styles.payBox} onClick={onPay}></Image>
          </View>
        ) : <Audio src={url} onPlay={onPlay} disabled={!url} />
      }
    </View>
  );
};

export default React.memo(Index);
