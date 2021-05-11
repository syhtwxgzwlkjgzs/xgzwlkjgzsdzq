import React, { memo, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '../../../components/message/instant-messaging';

import NoticeItem from '@components/message/notice-item';
import mock from '../mock.json';

const Index = () => {
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
    <div className={styles.container}>
      <Button>pc test</Button>
      <div className={styles.list}>
        <div className={styles.left}>
          {list.map((item) => {
            return <NoticeItem item={item} type={type} onDelete={handleDelete} key={item.id} />;
          })}
        </div>
        <div className={styles.right}></div>
      </div>
      <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} persona={'myself'} />
    </div>
  );
};

export default inject('site')(observer(memo(Index)));
