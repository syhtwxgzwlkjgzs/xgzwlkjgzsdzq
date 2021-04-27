import React from 'react';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import { Audio } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 语音
 * @prop {boolean} isPay 是否需要付费
 * @prop {string | number} money 付费金额
 * @prop {string} url 音频地址
 * @prop {function} goCheckAudio 音频点击事件
 */

const Index = ({ isPay = false, url, goCheckAudio = noop }) => {
  const onPlay = () => {
    console.log('正在播放');
  };
  return (
    <View className={styles.container}>
      <Audio src={url} onPlay={onPlay} />
      {/* 音频蒙层 已付费时隐藏 未付费时显示 */}
      {
        isPay && <View className={styles.payBox} onClick={goCheckAudio}></View>
      }
    </View>
  );
};

export default React.memo(Index);
