import React, { useState } from 'react';
import { View } from '@tarojs/components';
import { Button, Textarea, Icon, Input } from '@discuzq/design';

import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { onSubmit, dialogBoxRef, platform } = props;
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [typingValue, setTypingValue] = useState('');

  const scrollEnd = () => {
    dialogBoxRef.current.scrollTop = dialogBoxRef.current.scrollHeight;
  };

  const checkToShowCurrentMsgTime = (curTimestamp) => {
    const displayGapInMins = 3,
      diff = new Date(curTimestamp).getMinutes() - new Date(lastTimestamp).getMinutes();
    if (diff < displayGapInMins) {
      return false;
    } else {
      setLastTimestamp(curTimestamp);
      return true;
    }
  };

  const doSubmitClick = async () => {
    if (!typingValue || typeof onSubmit !== 'function') return;
    const currentTime = new Date().getTime(),
      msgPiece = {
        timestamp: currentTime,
        displayTimePanel: checkToShowCurrentMsgTime(currentTime),
        textType: 'string',
        text: typingValue,
      };

    try {
      const success = await onSubmit(msgPiece);
      if (success) {
        setTypingValue('');
        scrollEnd();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doPressEnter = (e) => {
    if (e.key !== 'Enter') return;
    doSubmitClick();
  };

  return (
    <>
      {platform === 'h5' && (
        <View className={styles.h5InteractionBox}>
          <View className={styles.inputWrapper}>
            <Input value={typingValue} placeholder=" 请输入内容" onChange={(e) => setTypingValue(e.target.value)} />
            <View className={styles.tools}>
              <View>
                <Icon name="SmilingFaceOutlined" size={20} color={'var(--color-text-secondary)'} />
              </View>
              <View className={styles.pictureUpload}>
                <Icon name="PictureOutlinedBig" size={20} color={'var(--color-text-secondary)'} />
              </View>
            </View>
          </View>
          <View className={styles.submit}>
            <Button type="primary" onClick={doSubmitClick}>
              发送
            </Button>
          </View>
        </View>
      )}
      {platform === 'pc' && (
        <View className={styles.pcInteractionBox}>
          <View className={styles.tools}>
            <View className={styles.emoj}>
              <Icon name="SmilingFaceOutlined" size={20} color={'var(--color-text-secondary)'} />
            </View>
            <View className={styles.pictureUpload}>
              <Icon name="PictureOutlinedBig" size={20} color={'var(--color-text-secondary)'} />
            </View>
          </View>
          <Textarea
            className={styles.typingArea}
            value={typingValue}
            focus={true}
            maxLength={5000}
            rows={3}
            onChange={(e) => setTypingValue(e.target.value)}
            onKeyDown={doPressEnter}
            placeholder={' 请输入内容'}
          />
          <View className={styles.submit}>
            <Button className={styles.submitBtn} type="primary" onClick={doSubmitClick}>
              发送
            </Button>
          </View>
        </View>
      )}
    </>
  );
};

export default InteractionBox;
