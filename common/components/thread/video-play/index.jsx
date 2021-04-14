import React from 'react';
import styles from './index.module.scss';
import { Video, Button } from '@discuzq/design';

/**
 * 视频
 * @prop {POST_TYPE} type 类型 0：未付费 1：已付费
 * @prop {string | number} width 视频宽度
 * @prop {string | number} height 视频高度
 * @prop {string | number} money 付费金额
 * @prop {string} coverUrl 封面图片
 * @prop {string} url 视频地址
 * @prop {string} time 总时长
 */



const Index = ({ type = POST_TYPE.UNPAID, width = 0, height = 0, coverUrl, url, time, money = 0 }) => {
    let player = null;
    const onReady = (ins) => {
        player = ins;
    };
    return (
        <div className={styles.container}>
            {
                type === POST_TYPE.UNPAID ? (
                    <Video
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
                        width={width}
                        height={height}
                        poster={coverUrl}
                        duration={time}
                    />
                ) : (
                    <div className={styles.payButton}>
                        <Button className={styles.button} type="primary"><span className={styles.icon}>$</span>支付{money}元查看视频</Button>
                    </div>
                )
            }
        </div>
    )
}
export const POST_TYPE = {
    UNPAID: 0,
    PAID: 1,
};

export default React.memo(Index) 