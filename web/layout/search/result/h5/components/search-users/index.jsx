import React from 'react';

import UserItem from '@components/thread/user-item';

import styles from './index.module.scss';

/**
 * 用户搜索结果
 * @prop {object[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const SearchUsers = ({ data = [], onItemClick }) => (
  <div className={styles.list}>
    {data.map((item, index) => (
      <UserItem key={index} imgSrc={item.avatar} needPadding={false} title={item.nickname} label={item.groupName} onClick={onItemClick} />
    ))}
  </div>
);

export default React.memo(SearchUsers);
