import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Video } from '@discuzq/design';
import { noop } from '../utils';
import { View, Text } from '@tarojs/components';
import { getElementRect, randomStr } from '../utils'

/**
 * 视频
 * @prop {boolean} isPay 是否需要付费
 * @prop {string | number} width 视频宽度
 * @prop {string | number} height 视频高度
 * @prop {string | number} money 付费金额
 * @prop {string} coverUrl 封面图片
 * @prop {string} url 视频地址
 * @prop {string} time 总时长
 * @prop {function} onPay 付费时，蒙层点击事件
 */


const Index = ({
  isPay = false,
  coverUrl,
  url,
  time,
  money = 0,
  onPay = noop,
}) => {
  let player = null;
  const ref = useRef();
  const videoId = useRef(`video${randomStr()}`);
  const [rect, setRect] = useState({});

  const onReady = (ins) => {
    player = ins;
  };

  useEffect(() => {
    getElementRect(videoId.current).then(res => {
      setRect({ width: res?.width || 378 });
    })
  }, []);

  return (
    <View id={videoId.current} className={styles.container} ref={ref}>
      <Video
        className={styles.videoBox}
        onReady={onReady}
        onPlay={(e) => {
        // console.log('play', e);
        }}
        onPause={(e) => {
        // console.log('pause', e);
        }}
        onEnded={(e) => {
        // console.log('ended', e);
        }}
        onTimeUpdate={e =>
        // console.log('timeupdate', e);
          1
        }
        onFullscreenChange={(e) => {
        // console.log('fullscreenchange', e);
        }}
        onProgress={(e) => {
        // console.log('progress', e);
        }}
        onLoadedMetaData={(e) => {
        // console.log('loadmetadata', e);
        }}
        onWaiting={(e) => {
        // console.log('waiting', e);
        }}
        onError={(e) => {
        // console.log('error', e);
        }}
        src={url}
        width={rect?.width || '343'}
        height={9 * (rect?.width || '343') / 16 || '224'}
        poster={coverUrl}
        duration={time}
      />
      {/* 视频蒙层 已付费时隐藏 未付费时显示 */}
      {
        isPay && <View className={styles.payBox} onClick={onPay}></View>
      }
    </View>
  );
};

export default React.memo(Index);
