import React from 'react';

import { User } from '../../../../../../components/search-result-item';

import styles from './index.module.scss';

/**
 * 用户搜索结果
 * @prop {object[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const SearchUsers = ({ data = [], onItemClick }) => (
  <div className={styles.list}>
    {data.map((item, index) => (
      <User key={index} data={item} onClick={onItemClick} />
    ))}
  </div>
);

export default React.memo(SearchUsers);
