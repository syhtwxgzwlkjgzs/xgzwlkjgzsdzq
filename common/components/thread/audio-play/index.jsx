import React from 'react';
import styles from './index.module.scss';
import { Audio, Button } from '@discuzq/design';

/**
 * 语音
 * @prop {POST_TYPE} type 类型 0：未付费 1：已付费
 * @prop {string | number} money 付费金额
 * @prop {string} url 音频地址
 */



const Index = ({ type = POST_TYPE.UNPAID, money = 0, url }) => {
    const onPlay = () => {
        console.log('正在播放');
    };
    return (
        <div className={styles.container}>
            {
                type === POST_TYPE.UNPAID ? (
                    <Audio src={url} onPlay={onPlay} />
                ) : (
                    <div className={styles.payButton}>
                        <Button className={styles.button} type="primary"><span className={styles.icon}>$</span>支付{money}元查看语音</Button>
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