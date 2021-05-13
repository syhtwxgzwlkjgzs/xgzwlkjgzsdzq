import React from 'react';
import { withRouter } from 'next/router';

import styles from './index.module.scss';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [], router, platform = 'h5'}) => {
  const onClick = ({ threadId } = {}) => {
    router.push(`/thread/${threadId}`);
  };
  return (
  <div className={styles.list}>
    {data?.map((item, index) => (
      <div
        key={index}
        className={`${styles.item} ${platform === 'pc' ? styles.itemPC : styles.itemH5}`}
        onClick={() => onClick(item)}
      >
        <div className={styles.prefix}>{item.prefix || '置顶'}</div>
        <div className={styles.title}>{item.title}</div>
      </div>
    ))}
  </div>
  );
};

export default withRouter(TopNews);
