import React from 'react';
import styles from './index.module.scss';
import { Video } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 视频
 * @prop {POST_TYPE} type 类型 0：未付费 1：已付费
 * @prop {string | number} width 视频宽度
 * @prop {string | number} height 视频高度
 * @prop {string | number} money 付费金额
 * @prop {string} coverUrl 封面图片
 * @prop {string} url 视频地址
 * @prop {string} time 总时长
 * @prop {function} goCheckVideo 视频点击事件
 */



const Index = ({
  type = POST_TYPE.UNPAID,
  width = 0,
  height = 0,
  coverUrl,
  url,
  time,
  money = 0,
  goCheckVideo = noop
}) => {
  let player = null;
  const onReady = (ins) => {
    player = ins;
  };
  return (
    <div className={styles.container}>
      <Video 
        className={styles.videoBox}
        onReady={onReady}
        onPlay={(e) => {
        console.log('play', e);
        }}
        onPause={(e) => {
        console.log('pause', e);
        }}
        onEnded={(e) => {
        console.log('ended', e);
        }}
        onTimeUpdate={(e) => {
        console.log('timeupdate', e);
        return 1;
        }}
        onFullscreenChange={(e) => {
        console.log('fullscreenchange', e);
        }}
        onProgress={(e) => {
        console.log('progress', e);
        }}
        onLoadedMetaData={(e) => {
        console.log('loadmetadata', e);
        }}
        onWaiting={(e) => {
        console.log('waiting', e);
        }}
        onError={(e) => {
        console.log('error', e);
        }}
        src={url}
        width={width || '343'}
        height={height || '224'}
        poster={coverUrl}
        duration={time}
      />
      {/* 视频蒙层 已付费时隐藏 未付费时显示 */}
      {
        type === POST_TYPE.UNPAID &&
        <div className={styles.payBox} onClick={goCheckVideo}></div>
      }
    </div>
  )
}
export const POST_TYPE = {
  UNPAID: 0,
  PAID: 1,
};

export default React.memo(Index) 