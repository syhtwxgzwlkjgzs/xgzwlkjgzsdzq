import React from 'react';
import { withRouter } from 'next/router';

import styles from './index.module.scss';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [], router , itemMargin='0'}) => {
  const onClick = ({ threadId } = {}) => {
    router.push(`/thread/${threadId}`);
  };
  const dataNum = data?.length - 1;
  return (
  <div className={styles.list}>
    {data?.map((item, index) => (
      <div key={index} className={`${styles.item} ${index !== dataNum && itemMargin=== '1' ? styles.itemBorder : ''}`} onClick={() => onClick(item)}>
        <div className={styles.prefix}>{item.prefix || '置顶'}</div>
        <div className={styles.title}>{item.title}</div>
      </div>
    ))}
  </div>
  );
};

export default withRouter(TopNews);
