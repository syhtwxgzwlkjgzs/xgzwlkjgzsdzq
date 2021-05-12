import React, { useMemo } from 'react';
import styles from './index.module.scss';
const Index = ({ money = 0, type = 0, onClick }) => {

  const title = useMemo(() => {
    return type === 0 ? '集赞领红包' : '评论领赏金'
  }, [type])

  const url = useMemo(() => {
    return type === 0 ? '/dzq-img/red-packet.png' : '/dzq-img/reward-question.png'
  }, [type])

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.wrapper}>
        <img className={styles.img} src={url} />
        <span className={styles.title}>{title}</span>
        {!!money && <span className={styles.money}>￥{money}</span>}
      </div>
    </div>
  );
}

export default React.memo(Index)

