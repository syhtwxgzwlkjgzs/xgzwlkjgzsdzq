import React from 'react';

import ThreadContent from '@components/thread';

import styles from './index.module.scss';

/**
 * 帖子搜索结果
 * @prop {object[]} data 帖子数据
 * @prop {function} onItemClick 帖子点击事件
 */
const SearchPosts = ({ data, onItemClick }) => (
  <div className={styles.list}>
    {data.map((item, index) => (
        <div key={index}>
          <ThreadContent data={item} onClick={onItemClick} />
          {index !== data.length - 1 && <div className={styles.hr} />}
        </div>
    ))}
  </div>
);

export default React.memo(SearchPosts);
