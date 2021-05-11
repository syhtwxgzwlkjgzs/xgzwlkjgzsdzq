import React, { useState, useEffect } from 'react';
import { View, Button } from '@tarojs/components';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '@components/message/instant-messaging';
import MessageCard from '@components/message/message-card';

import Notice from '@components/message/notice';
import mock from './mock.json';

const Index = inject('site')(
  observer(() => {
    // props,state
    const [messagesHistory, setMessagesHistory] = useState([]);
    const [type, setType] = useState('financial'); // chat,thread,financial,account
    const [list, setList] = useState([]);

    // hooks
    useEffect(() => {
      setList(mock[type]); // 设置渲染数据
    }, []);

    // handle
  const handleDelete = (item) => {
    const _list = [...list].filter(i => i.id !== item.id);
      setList(_list);
    };

    const doSubmit = (val) => {
      if (!val) return;
      setMessagesHistory([...messagesHistory, val]);
      return true;
    };

  const cardContent = [
    {
      iconName: 'RemindOutlined',
      title: '帖子通知',
      link: '#',
      totalCount: 0,
    },
    {
      iconName: 'RenminbiOutlined',
      title: '财务通知',
      link: '#',
      totalCount: 11,
    },
    {
      iconName: 'LeaveWordOutlined',
      title: '账号消息',
      link: '#',
      totalCount: 100,
    },
  ];

  return (
    <View className={styles.container}>
      <MessageCard cardItems={cardContent}/>
      <Button>mini test</Button>
      <Notice list={list} type={type} onBtnClick={handleDelete} />
      <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} />
    </View>
  );
}));

export default Index;
