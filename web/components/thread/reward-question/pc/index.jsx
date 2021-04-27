import React from 'react';
import styles from './index.module.scss';
import RedRacketBg from '../red-packet-bg';
/**
 * 悬赏问答
 * @prop {string | number} money 悬赏金额
 */
export default function PCIndex(props) {
  const {
    money = 0,
  } = props;
  return (
    <div className={styles.questionBox}>
        <div className={styles.money}>
          <RedRacketBg className={styles.RedRacketBg}></RedRacketBg>
          <div className={styles.text}>{money > 0 ? `￥${money}`: ''}</div>
        </div>
      </div>
  );
}

