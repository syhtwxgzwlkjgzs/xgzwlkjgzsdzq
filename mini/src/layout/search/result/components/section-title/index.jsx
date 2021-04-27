import React from 'react';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 栏目头部
 * @prop {string} title 标题
 * @prop {function} onShowMore 查看更多事件
 */
const TrendingTopics = ({  title, onShowMore }) => (
  <View className={styles.container}>
    <View className={styles.left}>
      <View className={styles.title}>{title}</View>
    </View>
    <View className={styles.right}>
      <View onClick={onShowMore} className={styles.more}>
        更多
      </View>
      <Icon name="RightOutlined" size={10} />
    </View>
  </View>
);

export default React.memo(TrendingTopics);
