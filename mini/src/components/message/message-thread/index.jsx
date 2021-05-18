import React from 'react'
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

const Index = ({message}) => {
  return (
    <View className={styles.container}>
      帖子消息
    </View>
  )
}

export default inject('message')(observer(Index));
