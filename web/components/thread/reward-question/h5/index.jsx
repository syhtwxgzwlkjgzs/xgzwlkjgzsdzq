import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Button } from '@discuzq/design';
import { noop } from '@components/thread/utils';
/**
 * 悬赏问答
 * @prop {POST_TYPE} type 类型 0：未回答 1：已回答
 * @prop {string | number} money 悬赏金额
 * @prop {string} title 悬赏名称
 * @prop {string} avatar 用户头像
 * @prop {string} username 用户名称
 * @prop {string} onClick 点击事件
 * @prop {string} content 悬赏问答内容
 */
export default function H5Index(props) {
  const {
    type = POST_TYPE.NO_ANSWER,
    money = 0,
    title,
    avatar,
    username,
    content,
    onClick = noop
  } = props;
  const texts = useMemo(() => {
    if (type === POST_TYPE.NO_ANSWER) {
      return title;
    }
    return (
      <>
        回答了<img className={styles.avatar} src={avatar} /><span className={styles.username}>{username || '匿名用户'}</span>的提问
      </>
    );
  }, [type]);
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.box}>
          <div className={styles.money}>
            <div className={styles.moneyTop}></div>
            <div className={styles.moneyText}>{money > 0 ? `￥${money}`: ''}</div>
            <div className={styles.moneyBottom}></div>
            <div className={styles.moneyReward}>赏</div>
          </div>
          <div className={styles.content}>
              <div className={styles.title}>{texts || ''}</div>
              <div className={styles.text}>{content || ''}</div>
          </div>
      </div>
      <Button className={styles.button} type="primary">{ type === POST_TYPE.NO_ANSWER ? '立即回答' : '查看答案'}</Button>
    </div>
  );
}
export const POST_TYPE = {
  NO_ANSWER: 0,
  ANSWERED: 1,
};
