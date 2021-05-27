import React, { useEffect, useMemo } from 'react'
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

import Card from '../message-card/index';
import Notice from '../notice/index';

// 映射账户消息的类型和请求动作
const actionMap = {
  '': ['accountMsgList', 'readAccountMsgList'],
  'at': ['atMsgList', 'readAtMsgList'],
  'reply': ['replyMsgList', 'readReplyMsgList'],
  'like': ['likeMsgList', 'readLikeMsgList']
}

const Index = ({ message, subPage }) => {
  const { atUnread, replyUnread, likeUnread, deleteMsg } = message;
  const [type, funcType] = useMemo(() => actionMap[subPage], [subPage]); // 根据路由变化，切换类型
  const { list, currentPage, totalPage } = message[type];

  // 监听账户消息子类型变化，初始化请求数据
  useEffect(() => {
    fetchMessageData(1);
  }, [type])

  // 请求数据
  const fetchMessageData = (initPage = 0) => {
    const { currentPage } = message[type];
    return message[funcType](initPage || currentPage + 1);
  }

  // 处理、过滤数据
  const handleRenderList = (data = []) => {
    let list = [];
    data.forEach(item => {
      list.push({
        id: item.id,
        createdAt: item.createdAt,
        threadId: item.threadId,
        content: item.postContent,
        title: item.threadTitle,
        type: item.type,
        avatar: item.userAvatar,
        userId: item.userId,
        username: item.username,
      })
    });

    return list;
  }

  // 更新未读消息
  const items = useMemo(() => {
    return [
      {
        iconName: 'AtOutlined',
        title: '@我的',
        link: '/subPages/message/index?page=account&subPage=at',
        totalCount: atUnread || 0,
      },
      {
        iconName: 'MessageOutlined',
        title: '回复我的',
        link: '/subPages/message/index?page=account&subPage=reply',
        totalCount: replyUnread || 0,
      },
      {
        iconName: 'LikeOutlined',
        title: '点赞我的',
        link: '/subPages/message/index?page=account&subPage=like',
        totalCount: likeUnread || 0,
      },
    ]
  }, [atUnread, replyUnread, likeUnread]);

  return (
    <View className={styles.container}>
      <Notice
        noMore={currentPage >= totalPage}
        topCard={
          type === 'accountMsgList'
            ? <Card items={items} onClick={(url) => Taro.navigateTo({ url })} />
            : null
        }
        list={handleRenderList(list)}
        type='account'
        onPullDown={() => fetchMessageData(1)}
        onScrollBottom={() => fetchMessageData()}
        onBtnClick={(item) => deleteMsg(item.id, type)}
      />
    </View>
  )
}

export default inject('message')(observer(Index));
