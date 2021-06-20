import React, { useRef, useEffect, useMemo, useState } from 'react';
import { View, Image } from '@tarojs/components';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const DialogBox = (props) => {
  // const { shownMessages, dialogBoxRef } = props;

  const { message, user, dialogId, showEmoji, keyboardHeight, inputBottom } = props;
  const { readDialogMsgList, dialogMsgList, dialogMsgListLength, updateDialog } = message;


  const [paddingBottom, setPaddingBottom] = useState(52);

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
    if (showEmoji || keyboardHeight) {
      setTimeout(scrollEnd, 300);
    }

    setTimeout(() => {
      let query = Taro.createSelectorQuery();
      query.select('#operation-box').boundingClientRect(rect => {
        let clientHeight = rect.height;
        // let clientWidth = rect.width;
        // let ratio = 750 / clientWidth;
        // let height = clientHeight * ratio;
        console.log(clientHeight);

        const padding = (keyboardHeight && !showEmoji) ? inputBottom : 0

        setPaddingBottom(clientHeight);
        setTimeout(scrollEnd, 300);
      }).exec();
    }, 0);

  }, [showEmoji, keyboardHeight]);

  const scrollEnd = () => {
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 30000,
        duration: 0
      });
    }, 0);
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
      userId: item.userId,
    })).reverse();
  }, [dialogMsgListLength]);

  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  useMemo(() => {
    setPreviewImageUrls(dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse());
  }, [dialogMsgList]);

  return (
    <View
      className={styles.dialogBox}
      style={{
        paddingBottom: `${paddingBottom}px`,
        // marginBottom: keyboardHeight ? 0 : '',
      }}
      ref={dialogBoxRef}>
      <View className={styles.box__inner}>
        {messagesHistory.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl, userId }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <View className={styles.msgTime}>{diffDate(timestamp)}</View>}
            <View className={(ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`) + ` ${styles.persona}`}>
              <View className={styles.profileIcon} onClick={() => {
                userId && Taro.navigateTo({ url: `/subPages/user/index?id=${userId}` });
              }}>
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
