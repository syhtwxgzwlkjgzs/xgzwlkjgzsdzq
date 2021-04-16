import React, { useCallback } from 'react';

import { User } from '../../../../../../components/search-result-item';
import List from '../list';

import styles from './index.module.scss';

/**
 * 用户搜索结果
 * @prop {object[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 * @prop {function} onRefresh 刷新事件
 * @prop {function} onFetchMore 上拉加载
 * @prop {boolean} refreshing  刷新中
 */
const SearchUsers = ({ data = [], refreshing, onRefresh, onFetchMore, onItemClick }) => {
  const renderItem = useCallback(
    ({ data: _data, index }) => <User key={index} data={_data[index]} onClick={onItemClick} />,
    [onItemClick],
  );

  return (
    <List
      containerClassName={styles.list}
      data={data}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onScrollBottom={onFetchMore}
      renderItem={renderItem}
    />
  );
};

export default React.memo(SearchUsers);
