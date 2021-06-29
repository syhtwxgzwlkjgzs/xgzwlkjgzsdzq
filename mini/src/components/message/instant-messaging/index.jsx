import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import Taro from '@tarojs/taro';
import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';
import styles from './index.module.scss';

const Index = ({ message, user, dialogId: _dialogId, username, nickname }) => {

  const { clearMessage } = message;

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dialogId, setDialogId] = useState(_dialogId);
  const [showEmoji, setShowEmoji] = useState(false);

  const inputBottom = 15; // 键盘弹起时输入框有一个向下的偏移量，要适配，单位px

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