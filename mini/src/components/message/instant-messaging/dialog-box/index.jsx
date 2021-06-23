import React, { useRef, useEffect, useMemo, useState } from 'react';
import { View, Image } from '@tarojs/components';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import { diffDate } from '@common/utils/diff-date';
import { getMessageImageSize } from '@common/utils/get-message-image-size';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const DialogBox = (props) => {
  // const { shownMessages, dialogBoxRef } = props;

  const { message, user, dialogId, showEmoji, keyboardHeight, inputBottom, hideEmoji } = props;
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

    return dialogMsgList.list.map(item => {
      let [width, height] = [200, 0]; // 兼容没有返回图片尺寸的旧图片
      if (item.imageUrl) {
        const size = item.imageUrl.match(/\?width=(\d+)&height=(\d+)$/);
        if (size) {
          [width, height] = getMessageImageSize(size[1], size[2]); // 计算图片显示尺寸
        }
      }

      return {
        timestamp: item.createdAt,
        userAvatar: item.user.avatar,
        displayTimePanel: true,
        textType: 'string',
        text: item.messageTextHtml,
        ownedBy: user.id === item.userId ? 'myself' : 'itself',
        imageUrl: item.imageUrl,
        width: width,
        height: height,
        userId: item.userId,
        nickname: item.user.username,
      }
    }).reverse();
  }, [dialogMsgListLength]);

  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  useMemo(() => {
    setPreviewImageUrls(dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse());
  }, [dialogMsgList]);

  return (
    <View
      onClick={() => {
        hideEmoji();
      }}
      className={styles.dialogBox}
      style={{
        paddingBottom: `${paddingBottom}px`,
        // marginBottom: keyboardHeight ? 0 : '',
      }}
      ref={dialogBoxRef}>
      <View className={styles.box__inner}>
        {messagesHistory.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl, userId, nickname, width, height }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <View className={styles.msgTime}>{diffDate(timestamp)}</View>}
            <View className={(ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`) + ` ${styles.persona}`}>
              <View className={styles.profileIcon} onClick={() => {
                userId && Taro.navigateTo({ url: `/subPages/user/index?id=${userId}` });
              }}>
                {userAvatar
                  ? <Avatar image={userAvatar} circle={true} />
                  : <Avatar text={nickname && nickname.toUpperCase()[0]} circle={true} style={{
                    backgroundColor: "#8590a6",
                  }} />
                }
              </View>
              {imageUrl ? (
                <Image
                  className={styles.msgImage}
                  mode={height ? "aspectFill" : "widthFix"}
                  style={{ width: `${width}px`, height: height ? `${height}px` : "auto" }}
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
