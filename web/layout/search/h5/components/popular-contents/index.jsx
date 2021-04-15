import React from 'react';

import { Post } from '../../../../../components/search-result-item';

import styles from './index.module.scss';

/**
 * 热门内容
 * @prop {object[]} data 帖子数据
 */
const PopularContents = ({ data, onItemClick }) => (
  <div className={styles.list}>
    {data.map((item, index, arr) => (
      <Post key={index} data={item} onClick={onItemClick} divider={index !== arr.length - 1} />
    ))}
  </div>
);

export default React.memo(PopularContents);
