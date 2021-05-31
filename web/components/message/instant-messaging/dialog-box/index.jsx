import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, ImagePreviewer } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

const DialogBox = (props) => {
  const { shownMessages, platform, message, user, dialogId, showEmoji } = props;
  const { readDialogMsgList, dialogMsgList, dialogMsgListLength } = message;

  const [previewerVisibled, setPreviewerVisibled] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');
  // const router = useRouter();
  // const dialogId = router.query.dialogId;
  const dialogBoxRef = useRef();
  const timeoutId = useRef();
  useEffect(() => {
    updateMsgList();
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  useEffect(() => {
    if (dialogId) {
      clearTimeout(timeoutId.current);
      updateMsgList();
    }
  }, [dialogId]);

  useEffect(() => {
    if (showEmoji) {
      scrollEnd();
    }
  }, [showEmoji]);

  const scrollEnd = () => {
    if (dialogBoxRef.current) {
      dialogBoxRef.current.scrollTop = dialogBoxRef?.current?.scrollHeight;
    }
  };

  // 每5秒轮询一次
  const updateMsgList = () => {
    readDialogMsgList(dialogId);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      updateMsgList();
    }, 5000);
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
      imageUrl: item.imageUrl,
    })).reverse();
  }, [dialogMsgListLength]);

  const imagePreviewerUrls = useMemo(() => {
    return dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse();
  }, [dialogMsgList]);

  return (
    <div className={platform === 'pc' ? styles.pcDialogBox : (showEmoji ? styles['h5DialogBox-emoji'] : styles.h5DialogBox)} ref={dialogBoxRef}>
      <div className={styles.box__inner}>
        {messagesHistory.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
            <div className={`${ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`} ${styles.persona}`}>
              <div className={styles.profileIcon}>
                <Avatar image={userAvatar || '/favicon.ico'} circle={true} />
              </div>
              {imageUrl ? (
                <div className={styles.msgContent}>
                  {imageUrl && <img style={{ width: '200px' }} src={imageUrl} onClick={() => {
                    setDefaultImg(imageUrl);
                    setPreviewerVisibled(true);
                  }} />}
                </div>
              ) : (
                <div className={styles.msgContent} dangerouslySetInnerHTML={{
                  __html: text,
                }}></div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <ImagePreviewer
        visible={previewerVisibled}
        onClose={() => {
          setPreviewerVisibled(false);
        }}
        imgUrls={imagePreviewerUrls}
        currentUrl={defaultImg}
      />
    </div>
  );
};

export default  inject('message', 'user')(observer(DialogBox));
