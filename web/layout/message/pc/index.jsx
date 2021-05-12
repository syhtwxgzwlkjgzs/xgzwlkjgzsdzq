import React, { memo, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '../../../components/message/instant-messaging';
import MessageCard from '@components/message/message-card';

import Notice from '@components/message/notice';
import mock from '../mock.json';

const Index = () => {
  // props,state
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [type, setType] = useState('account'); // chat,thread,financial,account
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
    <div className={styles.container}>
      <MessageCard />
      <div>pc test</div>
      <div className={styles.list}>
        <div className={styles.left}>
          <Notice list={list} type={type} onBtnClick={handleDelete} />
        </div>
        <div className={styles.right}></div>
      </div>
      <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} />
    </div>
  );
};

export default inject('site')(observer(Index));
