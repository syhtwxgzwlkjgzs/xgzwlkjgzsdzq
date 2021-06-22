import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import DialogBox from './dialog-box';
import InteractionBox from './interaction-box';
import styles from './index.module.scss';

const Index = (props) => {
  const { site: { platform }, dialogId, username, nickname, message: { clearMessage, readDialogMsgList } } = props;
  const [showEmoji, setShowEmoji] = useState(false);
  const dialogBoxRef = useRef();
  const timeoutId = useRef();
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

  // 弹出表情时，消息列表拉到最底下
  useEffect(() => {
    if (showEmoji) {
      setTimeout(scrollEnd, 0);
    }
  }, [showEmoji]);

  // 卸载时清除store中的消息数据
  useEffect(() => (() => {
    clearMessage();
  }));

  return (
    <div className={platform === 'h5' ? styles.h5Page : styles.pcPage}>
      <DialogBox
        ref={dialogBoxRef}
        nickname={nickname}
        platform={platform}
        dialogId={dialogId}
        showEmoji={showEmoji}
        username={username}
      />
      <InteractionBox
        nickname={nickname}
        username={username}
        platform={platform}
        dialogId={dialogId}
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
      />
    </div>
  );
};


export default inject('message', 'site')(observer(Index));
