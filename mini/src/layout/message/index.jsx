import React, { useState, useEffect } from 'react';
import { View, Button } from '@tarojs/components';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '@components/message/instant-messaging';
import CategoryList from '@components/message/category-list';

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

  return (
    <View className={styles.container}>
      <CategoryList />
      <Button>mini test</Button>
      <Notice list={list} type={type} onBtnClick={handleDelete} />
      <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} />
    </View>
  );
}));

export default Index;
