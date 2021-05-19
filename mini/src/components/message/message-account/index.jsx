import React, { useState } from 'react'
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import MessageCard from '../message-card/index'
import styles from './index.module.scss';

const Index = ({ message }) => {
  const [items, setItems] = useState([
    {
      iconName: 'AtOutlined',
      title: '@我的',
      link: '/subPages/message/index?page=account&subPage=at',
      totalCount: 0,
    },
    {
      iconName: 'MessageOutlined',
      title: '回复我的',
      link: '/subPages/message/index?page=account&subPage=reply',
      totalCount: 0,
    },
    {
      iconName: 'LikeOutlined',
      title: '点赞我的',
      link: '/subPages/message/index?page=account&subPage=like',
      totalCount: 0,
    },
  ]);

  const handleItemsClick = (link) => { // 点击items项进行路由跳转
    Taro.navigateTo({ url: link });
  }


  return (
    <View className={styles.container}>
      <View>
        <MessageCard items={items} onClick={handleItemsClick} />
      </View>
      账户消息
    </View>
  )
}

export default inject('message')(observer(Index));
