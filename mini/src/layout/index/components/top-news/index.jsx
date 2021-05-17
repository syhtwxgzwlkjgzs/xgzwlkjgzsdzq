import React from 'react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import { RichText } from '@discuzq/design';

/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [] }) => {
  const onClick = ({ threadId } = {}) => {
    Taro.navigateTo({url: `/subPages/thread/detail/index?id=${threadId}`});
  };
  // 过滤内容
  const filterContent = (content) => {
    let newContent = content ? s9e.parse(content) : '暂无内容';
    newContent = xss(newContent);

    return newContent;
  };
  return (
  <View className={styles.list}>
    {data?.map((item, index) => (
      <View key={index} className={styles.item} onClick={() => onClick(item)}>
        <View className={styles.prefix}>{item.prefix || '置顶'}</View>
        <View className={styles.title}>
          <RichText onClick={() => onClick(item)} className={styles.richText} content={filterContent(item.title)} />
        </View>
      </View>
    ))}
  </View>
  );
};

export default TopNews;
