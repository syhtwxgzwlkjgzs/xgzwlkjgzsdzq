import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { Button } from '@discuzq/design';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '@components/message/instant-messaging';

import NoticeItem from '@components/message/notice-item';
import SliderLeft from '@components/message/slider-left';
import mock from './mock.json';

const Index = inject('site')(
  observer(() => {
    // props,state
    const [messagesHistory, setMessagesHistory] = useState([]);
    const [type, setType] = useState('user'); // chat,system,financial,user
    const [list, setList] = useState([]);

    // hooks
    useEffect(() => {
      setList(mock[type]); // 设置渲染数据
    }, []);

    // handle
    const handleDelete = (id) => {
      const _list = [...list].filter((item) => item.id !== id);
      setList(_list);
    };

    const doSubmit = (val) => {
      if (!val) return;
      setMessagesHistory([...messagesHistory, val]);
      return true;
    };

    return (
      <View className={styles.container}>
        <Button>mini test</Button>
        <SliderLeft list={list} offsetLeft={'-74px'} type={type} RenderItem={NoticeItem} onDelete={handleDelete} />
        <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} />
      </View>
    );
  }),
);

export default Index;
