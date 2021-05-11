import React, { memo, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '../instant-messaging';

import NoticeItem from '@components/message/notice-item';
import SliderLeft from '@components/message/slider-left/index';
import mock from '../mock.json';

const Index = ({ page, subPage, dialogId }) => {
  // props,state
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [type, setType] = useState('account'); // chat,thread,financial,account
  const [list, setList] = useState([]);

  // hooks
  useEffect(() => {
    setList(mock[type]); // 设置渲染数据
  }, [])

  // handle
  const handleDelete = (id) => {
    const _list = [...list].filter(item => item.id !== id);
    setList(_list);
  }

  const doSubmit = (val) => {
    if (!val) return;
    setMessagesHistory([...messagesHistory, val]);
    return true;
  };

  return (
    <div className={styles.container}>
      <SliderLeft
        list={list}
        offsetLeft={'-74px'}
        type={type}
        RenderItem={NoticeItem}
        onDelete={handleDelete}
      />
      <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} persona={'myself'} />
    </div>
  );
};

export default inject('site')(observer(memo(Index)));
