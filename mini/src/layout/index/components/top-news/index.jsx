import React from 'react';
import { withRouter } from 'next/router';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [], router }) => {
  const onClick = ({ threadId } = {}) => {
    router.push(`/thread/${threadId}`);
  };
  return (
  <View className={styles.list}>
    {data?.map((item, index) => (
      <View key={index} className={styles.item} onClick={() => onClick(item)}>
        <View className={styles.prefix}>{item.prefix || '置顶'}</View>
        <View className={styles.title}>{item.title}</View>
      </View>
    ))}
  </View>
  );
};

export default withRouter(TopNews);
