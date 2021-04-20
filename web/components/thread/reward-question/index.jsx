import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Button } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 悬赏问答
 * @prop {POST_TYPE} type 类型 0：未回答 1：已回答
 * @prop {string | number} money 悬赏金额
 * @prop {string} title 悬赏名称
 * @prop {string} avatar 用户头像
 * @prop {string} username 用户名称
 * @prop {function} onClick 点击事件
 * @prop {string} content 悬赏问答内容
 */

const Index = ({
  type = POST_TYPE.NO_ANSWER,
  money = 0,
  title,
  avatar,
  username,
  content,
  onClick = noop 
}) => {
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
        <div className={styles.money}>￥{money}</div>
        <div className={styles.content}>
          <div className={styles.title}>{texts || '悬赏问答'}</div>
          <div className={styles.text}>{content || '暂无内容'}</div>
        </div>
      </div>
      <Button className={styles.button} type="primary">{ type === POST_TYPE.NO_ANSWER ? '立即回答' : '查看答案'}</Button>
    </div>
  );
};
export const POST_TYPE = {
  NO_ANSWER: 0,
  ANSWERED: 1,
};

export default React.memo(Index);
