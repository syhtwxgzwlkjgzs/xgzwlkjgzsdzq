import React, { useState } from 'react'
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import { Button } from "@discuzq/design";
import MessageCard from '../message-card/index'
import styles from './index.module.scss';

const Index = ({ message }) => {
  const [items, setItems] = useState([
    {
      iconName: 'RemindOutlined',
      title: '帖子通知',
      link: '/subPages/message/index?page=thread',
      totalCount: 0,
    },
    {
      iconName: 'RenminbiOutlined',
      title: '财务通知',
      link: '/subPages/message/index?page=financial',
      totalCount: 0,
    },
    {
      iconName: 'LeaveWordOutlined',
      title: '账号消息',
      link: '/subPages/message/index?page=account',
      totalCount: 0,
    },
  ]);
  // test
  const handleItemsClick = (link) => { // 点击items项进行路由跳转
    Taro.navigateTo({ url: link });
  }

  const toOtherPage = (page) => {
    Taro.navigateTo({ url: `/subPages/message/index?page=${page}` });
  }

  console.log('message :>> ', message);

  return (
    <View className={styles.container}>
      <MessageCard items={items} onClick={handleItemsClick}/>
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