import React, { memo, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import InstantMessaging from '../../../components/message/instant-messaging';
import CategoryList from '@components/message/category-list';

import MessageAccount from '@components/message/message-account';
import MessageIndex from '@components/message/message-index';
import Notice from '@components/message/notice';
import mock from '../mock.json';

const Index = ({ page, subPage, dialogId, message }) => {
  const { readAccountMsgList, readDialogList } = message;

  useEffect(() => {
    readAccountMsgList(1);
    readDialogList();
  });


  console.log(message);
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

  switch (page) {
    case 'index':
      return <MessageIndex />;
    case 'account':
      return <MessageAccount subPage={subPage} />;
  }

  // return (
  //   <div className={styles.container}>
  //     <Notice list={list} type={type} onBtnClick={handleDelete} />
  //     <InstantMessaging messagesHistory={messagesHistory} onSubmit={doSubmit} />
  //   </div>
  // );
};

export default inject('site', 'message')(observer(memo(Index)));
