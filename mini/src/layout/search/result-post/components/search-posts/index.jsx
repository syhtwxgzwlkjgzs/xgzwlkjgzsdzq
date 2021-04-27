import React, { useCallback } from 'react';

import { Post } from '../../../../../../components/search-result-item';
import List from '../list';

import styles from './index.module.scss';

/**
 * 帖子搜索结果
 * @prop {object[]} data 帖子数据
 * @prop {function} onItemClick 帖子点击事件
 * @prop {function} onRefresh 刷新事件
 * @prop {function} onFetchMore 上拉加载
 * @prop {boolean} refreshing  刷新中
 */
const SearchPosts = ({ data, refreshing, onRefresh, onFetchMore, onItemClick }) => {
  const renderItem = useCallback(
    ({ data: _data, index }) => (
      <Post key={index} data={_data[index]} onClick={onItemClick} Viewider={index !== _data.length - 1} />
    ),
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

export default React.memo(SearchPosts);
