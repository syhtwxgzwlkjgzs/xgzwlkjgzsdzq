import React, { useEffect, useState, useMemo } from 'react';
import { View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';
import styles from './index.module.scss';
import { getMessageImageSize } from '@common/utils/get-message-image-size';
import { getMessageTimestamp } from '@common/utils/get-message-timestamp';

const Index = ({ message, user, dialogId: _dialogId, username, nickname }) => {

  const { clearMessage, dialogMsgListLength, dialogMsgList, updateDialog } = message;

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dialogId, setDialogId] = useState(_dialogId);
  const [showEmoji, setShowEmoji] = useState(false);

  const inputBottom = 15; // 键盘弹起时输入框有一个向下的偏移量，要适配，单位px

  const scrollEnd = () => {
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 30000,
        duration: 0
      });
    }, 0);
  };

  const messagesHistory = useMemo(() => {
    setTimeout(() => {
      scrollEnd();
      // 把消息状态更新为已读
      updateDialog(dialogId);
    }, 100);

    const _list = dialogMsgList.list.map((item) => {
      let [width, height] = [150, 150]; // 兼容没有返回图片尺寸的旧图片
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
    });

    return getMessageTimestamp(_list.filter(item => (item.imageUrl || item.text)).reverse());
  }, [dialogMsgListLength]);

  useEffect(() => {
    setDialogId(_dialogId);

    // 监听键盘高度变化
    Taro.onKeyboardHeightChange(res => {
      setKeyboardHeight(res?.height || 0);
    });

    return () => {
      clearMessage();
    };
  }, []);

  return (
    <View className={styles.container}>
      <DialogBox
        messagesHistory={messagesHistory}
        scrollEnd={scrollEnd}
        dialogId={dialogId}
        showEmoji={showEmoji}
        hideEmoji={() => {
          setShowEmoji(false);
        }}
        keyboardHeight={keyboardHeight}
        inputBottom={inputBottom}
      />
      <InteractionBox
        username={username}
        keyboardHeight={keyboardHeight}
        inputBottom={inputBottom}
        showEmoji={showEmoji}
        dialogId={dialogId}
        switchEmoji={(show) => {
          setShowEmoji(show);
        }}
        updateDialogId={(dialogId) => {
          setDialogId(dialogId);
        }}
      />
    </View>
  );
};

export default inject('message', 'user')(observer(Index));