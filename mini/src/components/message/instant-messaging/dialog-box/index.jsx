import React, { useRef, useEffect, useMemo, useState } from 'react';
import { View, Image } from '@tarojs/components';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const DialogBox = (props) => {
  // const { shownMessages, dialogBoxRef } = props;

  const { message, user, dialogId, showEmoji } = props;
  const { readDialogMsgList, dialogMsgList, dialogMsgListLength, updateDialog } = message;

  // const [previewerVisibled, setPreviewerVisibled] = useState(false);
  // const [defaultImg, setDefaultImg] = useState('');
  // const router = useRouter();
  // const dialogId = router.query.dialogId;
  const dialogBoxRef = useRef();
  const timeoutId = useRef();
  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
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
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
      success: (a,b,c) => {
        console.log(a,b,c);
      }
    });


    // if (dialogBoxRef.current) {
    //   dialogBoxRef.current.scrollTop = dialogBoxRef?.current?.scrollHeight;
    // }
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
      // 把消息状态更新为已读
      updateDialog(dialogId);
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

  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  useMemo(() => {
    setPreviewImageUrls(dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse());
  }, [dialogMsgList]);

  return (
    <View className={styles.dialogBox} style={{ bottom: showEmoji ? '385px' : '52px' }} ref={dialogBoxRef}>
      <View className={styles.box__inner}>
        {messagesHistory.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <View className={styles.msgTime}>{diffDate(timestamp)}</View>}
            <View className={(ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`) + ` ${styles.persona}`}>
              <View className={styles.profileIcon}>
                <Avatar image={userAvatar || '/favicon.ico'} circle={true} />
              </View>
              {imageUrl ? (
                <Image
                  className={styles.msgImage}
                  mode='widthFix'
                  style='width: 200px;'
                  src={imageUrl}
                  onClick={() => {
                    Taro.previewImage({
                      current: imageUrl,
                      urls: previewImageUrls
                    });
                  }}
                  onLoad={scrollEnd}
                />
              ) : (
                <View className={styles.msgContent} dangerouslySetInnerHTML={{
                  __html: text,
                }}></View>
              )}
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default inject('message', 'user')(observer(DialogBox));
