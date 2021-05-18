import React from 'react'
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import { Button } from "@discuzq/design";
import styles from './index.module.scss';

const Index = ({ message }) => {

  // test
  const toOtherPage = (page) => {
    Taro.navigateTo({url: `/subPages/message/index?page=${page}` });
  }

  console.log('message :>> ', message);

  return (
    <View className={styles.container}>
      <View>首页消息</View>

      <Button onClick={() => toOtherPage('index')}>首页</Button>
      <Button onClick={() => toOtherPage('chat')}>私聊</Button>
      <Button onClick={() => toOtherPage('thread')}>帖子</Button>
      <Button onClick={() => toOtherPage('financial')}>财务</Button>
      <Button onClick={() => toOtherPage('account')}>账户</Button>
    </View>
  )
}

export default inject('message')(observer(Index));