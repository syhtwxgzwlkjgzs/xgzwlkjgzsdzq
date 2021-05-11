import React, { memo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';

import MessageCard from '@components/message/message-card'
import Notice from '@components/message/notice';

import styles from './index.module.scss';

const MessageIndex = ({ message }) => {
  const [type, setType] = useState('account'); // chat,thread,financial,account
  const [list, setList] = useState([]);

  const { threadUnread, financialUnread, accountUnread } = message;

  const cardContent = [
    {
      iconName: 'RemindOutlined',
      title: '帖子通知',
      link: '/message/?page=thread',
      totalCount: threadUnread,
    },
    {
      iconName: 'RenminbiOutlined',
      title: '财务通知',
      link: '/message/?page=financial',
      totalCount: financialUnread,
    },
    {
      iconName: 'LeaveWordOutlined',
      title: '账号消息',
      link: '/message/?page=account',
      totalCount: accountUnread,
    },
  ];

  const handleDelete = (item) => {
    const _list = [...list].filter(i => i.id !== item.id);
    setList(_list);
  };

  return (
    <div className={styles.container}>
      <MessageCard cardItems={cardContent}/>
      <Notice list={list} type={type} onBtnClick={handleDelete} />
    </div>
  )
}

export default inject('site', 'message')(observer(memo(MessageIndex)));
