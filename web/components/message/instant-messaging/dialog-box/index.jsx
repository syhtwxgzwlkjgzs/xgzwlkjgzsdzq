import React, { useEffect, useMemo, useRef } from 'react';
import { Avatar } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';

import styles from './index.module.scss';

const DialogBox = (props) => {
  const { shownMessages, platform, message, user, dialogId, showEmoji } = props;
  const { readDialogMsgList, dialogMsgList, createDialogMsg } = message;
  const dialogBoxRef = useRef();
  let timeoutId = null;
  useEffect(() => {
    updateMsgList();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollEnd = () => {
    if (dialogBoxRef.current) {
      dialogBoxRef.current.scrollTop = dialogBoxRef?.current?.scrollHeight;
    }
  };

  // 每2秒轮询一次
  const updateMsgList = () => {
    readDialogMsgList(dialogId);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      updateMsgList();
    }, 10000);
  };

  const messagesHistory = useMemo(() => {
    setTimeout(() => {
      scrollEnd();
    }, 100);
    return dialogMsgList.list.map(item => ({
      timestamp: item.createdAt,
      userAvatar: item.user.avatar,
      displayTimePanel: true,
      textType: 'string',
      text: item.messageTextHtml,
      ownedBy: user.id === item.userId ? 'myself' : 'itself',
    })).reverse();
  }, [dialogMsgList]);

  return (
    <div className={platform === 'pc' ? styles.pcDialogBox : (showEmoji ? styles['h5DialogBox-emoji'] : styles.h5DialogBox)} ref={dialogBoxRef}>
      <div className={styles.box__inner}>
        {messagesHistory.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
            <div className={`${ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`} ${styles.persona}`}>
              <div className={styles.profileIcon}>
                <Avatar image={userAvatar || '/favicon.ico'} circle={true} />
              </div>
              <div className={styles.msgContent} dangerouslySetInnerHTML={{
                __html: text,
              }}></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default  inject('message', 'user')(observer(DialogBox));
