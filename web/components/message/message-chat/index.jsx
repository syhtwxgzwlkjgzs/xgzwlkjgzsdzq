import React, { memo, useEffect, useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import InstantMessaging from '../instant-messaging';

const Index = ({ dialogId, message, user }) => {
  const { readDialogMsgList, dialogMsgList, createDialogMsg } = message;

  let timeoutId = null;
  useEffect(() => {
    updateMsgList();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // 每2秒轮询一次
  const updateMsgList = () => {
    readDialogMsgList(dialogId);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      updateMsgList();
    }, 10000);
  };

  const messagesHistory = useMemo(() => {
    return dialogMsgList.list
      .map((item) => ({
        timestamp: item.createdAt,
        userAvatar: item.user.avatar,
        displayTimePanel: true,
        textType: 'string',
        text: item.summary,
        ownedBy: user.id === item.userId ? 'myself' : 'itself',
      }))
      .reverse();
  }, [dialogMsgList]);

  return (
    <div className={styles.wrapper}>
      <InstantMessaging
        messagesHistory={messagesHistory}
        onSubmit={async (val) => {
          const ret = await createDialogMsg({
            messageText: val.text,
            dialogId,
          });
          if (ret.code === 0) updateMsgList();
        }}
      />
    </div>
  );
};

export default inject('message', 'user')(observer(Index));
