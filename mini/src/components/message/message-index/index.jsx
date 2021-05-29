import React, { useEffect, useCallback, useMemo } from 'react'
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

import Notice from '@components/message/notice';
import Card from '@components/message/message-card';
import BottomNavBar from '@components/bottom-nav-bar';

const Index = ({ message }) => {
  const { readDialogList, dialogList, threadUnread, financialUnread, accountUnread } = message;
  const { currentPage, totalPage, list } = dialogList;
  console.log('message :>> ', message);

  // 初始化请求数据
  useEffect(async () => {
    await readDialogList(1);
  }, [])

  // 更新未读消息
  const items = useMemo(() => {
    return [
      {
        iconName: 'RemindOutlined',
        title: '帖子通知',
        link: '/subPages/message/index?page=thread',
        totalCount: threadUnread || 0,
      },
      {
        iconName: 'RenminbiOutlined',
        title: '财务通知',
        link: '/subPages/message/index?page=financial',
        totalCount: financialUnread || 0,
      },
      {
        iconName: 'LeaveWordOutlined',
        title: '账号消息',
        link: '/subPages/message/index?page=account',
        totalCount: accountUnread || 0,
      },
    ]
  }, [threadUnread, financialUnread, accountUnread]);

  // 过滤展示数据
  const formatChatDialogList = (data = []) => {
    const newList = [];
    data.forEach((item) => {
      const { dialogMessage, sender } = item;
      newList.push({
        id: item.id,
        createdAt: dialogMessage?.createdAt,
        dialogId: dialogMessage?.dialogId,
        content: dialogMessage?.summary,
        avatar: sender?.avatar,
        userId: sender?.userId,
        username: sender?.username,
        unreadCount: item.unreadCount,
      });
    });

    return newList;
  };

  // 处理下拉
  const onPullDown = useCallback(() => {
    return readDialogList(1);
  }, [])

  // 处理上拉
  const handleScrollBottom = useCallback(() => {
    return readDialogList(currentPage + 1);
  }, [currentPage])

  // 跳转其它消息类型
  const toOtherMessage = useCallback((url) => {
    Taro.navigateTo({ url });
  }, [])

  return (
    <View className={styles.container}>
      <Notice
        type='chat'
        withBottomBar={true}
        noMore={currentPage >= totalPage}
        topCard={<Card items={items} onClick={toOtherMessage} />}
        list={formatChatDialogList(list)}
        onPullDown={onPullDown}
        onScrollBottom={handleScrollBottom}
        onBtnClick={() => deleteDialog(item.id)}
      />
      <BottomNavBar curr={'message'} />
    </View>
  )
}

export default inject('message')(observer(Index));