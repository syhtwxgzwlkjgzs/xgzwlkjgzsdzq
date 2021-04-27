import React from 'react';

import { User } from '../../../../../../components/search-result-item';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 用户搜索结果
 * @prop {object[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const SearchUsers = ({ data = [], onItemClick }) => (
  <View className={styles.list}>
    {data.map((item, index) => (
      <User key={index} data={item} onClick={onItemClick} />
    ))}
  </View>
);

export default React.memo(SearchUsers);
