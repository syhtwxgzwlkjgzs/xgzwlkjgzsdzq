import React from 'react';

import ThreadContent from '@components/thread';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 帖子搜索结果
 * @prop {object[]} data 帖子数据
 * @prop {function} onItemClick 帖子点击事件
 */
const SearchPosts = ({ data, onItemClick }) => (
  <View className={styles.list}>
    {data.map((item, index, arr) => (
      <ThreadContent key={index} className={styles.listItem} data={item} onClick={onItemClick} />
    ))}
  </View>
);

export default React.memo(SearchPosts);
