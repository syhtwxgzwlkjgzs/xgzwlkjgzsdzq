import React from 'react';
import { Icon } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import TopicHeaderImg from '../../../../../../../web/public/dzq-img/topic-header.png';

/**
 * 用户组件
 * @prop {string} title 话题标题
 * @prop {number} viewNum 热度
 * @prop {number} contentNum 内容数
 * @prop {function} onCViewck 全部话题点击事件
 */
const TopicHeader = ({ title, viewNum = 0, contentNum = 0, onShare = noop }) => {
  return (
    <View className={styles.container} style={{ backgroundImage: `url('${TopicHeaderImg}')` }}>
      <View className={styles.title}>{title && `#${title}#`}</View>
      <View className={styles.allTopic}>
        <a href="/topic">全部话题 &gt;</a>
      </View>
      <View className={styles.siteInfo}>
          <View>
            <Text className={styles.text}>热度</Text>
            <Text className={styles.content}>{viewNum}</Text>
          </View>
          <View>
            <Text className={styles.text}>内容数</Text>
            <Text className={styles.content}>{contentNum}</Text>
          </View>
          <View onCViewck={onShare}>
            <Icon className={styles.shareIcon} color="#8590a6" name="ShareAltOutViewned"/>
            <Text className={styles.text}>分享</Text>
          </View>
        </View>
    </View>
  );
};

export default React.memo(TopicHeader);
