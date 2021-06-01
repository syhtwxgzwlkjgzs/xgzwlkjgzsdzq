import React from 'react';
import Icon from '@discuzq/design/dist/components/icon/index';
import { noop } from '@components/thread/utils';
import styles from './index.module.scss';
import { View, Text, Button, Image } from '@tarojs/components';
import TopicHeaderImg from '../../../../../../../web/public/dzq-img/topic-header.png';
import Router from '@discuzq/sdk/dist/router';

/**
 * 用户组件
 * @prop {string} title 话题标题
 * @prop {number} viewNum 热度
 * @prop {number} contentNum 内容数
 * @prop {function} onClick 全部话题点击事件
 */
const TopicHeader = ({ title, viewNum = 0, contentNum = 0, onShare = noop }) => {
  const goList = () => {
    Router.push({url: '/subPages/search/result-topic/index'});
  }
  return (
    <View className={styles.contain}>
      <Image src={TopicHeaderImg}></Image>
      <View className={styles.container}>
        <View className={styles.title}>{title && `#${title}#`}</View>
        <View className={styles.siteInfo}>
            <View>
              <Text className={styles.text}>热度</Text>
              <Text className={styles.content}>{viewNum}</Text>
            </View>
            <View className={styles.hr}></View>
            <View>
              <Text className={styles.text}>内容数</Text>
              <Text className={styles.content}>{contentNum}</Text>
            </View>
            <View className={styles.hr}></View>
            <Button plain='true' openType='share' data-from='topicHead'>
              <Icon className={styles.shareIcon}name="ShareAltOutlined" size={14} />
              <Text className={styles.text}>分享</Text>
            </Button>
            <View className={styles.hr}></View>
            <View onClick={goList}>
              <Text className={styles.text}>全部话题</Text>
              <Icon className={styles.rightIcon} name="RightOutlined" size={12} />
            </View>
          </View>
        </View>
    </View>
  );
};

export default React.memo(TopicHeader);
