import React from 'react';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';
import { View, Image } from '@tarojs/components';

/**
 * 栏目头部
 * @prop {string} icon 图标url
 * @prop {string} title 标题
 * @prop {function} onShowMore 查看更多事件
 * @prop {boolean} isShowMore 是否显示更多
 */
const TrendingTopics = ({ icon, title, onShowMore, isShowMore = true }) => (
  <View className={styles.container}>
    <View className={styles.left}>
      <Image src={icon} />
      <View className={styles.title}>{title}</View>
    </View>
    {
      isShowMore ?
      <View className={styles.right}>
        <View onClick={onShowMore} className={styles.more}>
          更多
        </View>
        <Icon name="RightOutlined" size={10} />
      </View>
      : ''
    }
  </View>
);

export default React.memo(TrendingTopics);
