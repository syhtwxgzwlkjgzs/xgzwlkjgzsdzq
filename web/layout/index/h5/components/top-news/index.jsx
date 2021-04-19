import React from 'react';

import styles from './index.module.scss';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [] }) => (
  <div className={styles.list}>
    {data.map((item, index) => (
      <div key={index} className={styles.item}>
        <div className={styles.prefix}>{item.prefix || '置顶'}</div>
        <div className={styles.title}>{item.title}</div>
      </div>
    ))}
  </div>
);

export default TopNews;
