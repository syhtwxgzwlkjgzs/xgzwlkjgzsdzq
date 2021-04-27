import React from 'react';

import ThreadContent from '@components/thread';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 热门内容
 * @prop {object[]} data 帖子数据
 */
const PopularContents = ({ data, onItemClick }) => (
  <View className={styles.list}>
    {
      data.map((item, index) => <ThreadContent data={item} key={index} />)
    }
  </View>
);

export default React.memo(PopularContents);
