import React, { memo, useEffect, useMemo, useState } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

import Header from '@components/header';
import InstantMessaging from '../instant-messaging';

const Index = ({ dialogId, message, user }) => {
  // const { readDialogMsgList, dialogMsgList, createDialogMsg } = message;

  // let timeoutId = null;
  // useEffect(() => {
  //   updateMsgList();
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, []);

  // // 每2秒轮询一次
  // const updateMsgList = () => {
  //   readDialogMsgList(dialogId);
  //   clearTimeout(timeoutId);
  //   timeoutId = setTimeout(() => {
  //     updateMsgList();
  //   }, 10000);
  // };

  // const messagesHistory = useMemo(() => dialogMsgList.list.map(item => ({
  //   timestamp: item.createdAt,
  //   userAvatar: item.user.avatar,
  //   displayTimePanel: true,
  //   textType: 'string',
  //   text: item.summary,
  //   ownedBy: user.id === item.userId ? 'myself' : 'itself',
  // })).reverse(), [dialogMsgList]);



  return (
    <div className={styles.wrapper}>
      <Header />
      <InstantMessaging dialogId={dialogId} />
    </div>
  );
};

export default inject('message', 'user')(observer(Index));
