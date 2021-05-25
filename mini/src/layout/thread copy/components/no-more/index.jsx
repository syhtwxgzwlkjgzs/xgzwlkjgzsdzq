import React from 'react';
import classNames from 'classnames';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

export default function NoMore(props) {
  const { empty } = props;
  return empty
    ? <View className={classNames(styles.container, empty && styles.empty)}>暂无评论</View>
    : <View className={styles.container}>没有更多数据了</View>;
}
