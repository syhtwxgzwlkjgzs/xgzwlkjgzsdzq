
import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';

const showTop = (props) => {
  const { showContent, setTop } = props;

  return (
    <View className={`${styles.setTop} ${setTop ? styles.inTop : styles.outTop}`}>
      <Text className={styles.setTopIcon}>
        <Icon name='CheckOutlined'></Icon>
      </Text>
      {
        showContent ? '置顶成功' : '已取消置顶'
      }
    </View>);
};

export default showTop;
