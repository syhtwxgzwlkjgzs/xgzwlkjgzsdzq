import React from 'react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [] }) => {
  const onClick = ({ threadId } = {}) => {
    Taro.navigateTo({url: `/pages/thread/index?id=${threadId}`});
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

export default TopNews;
