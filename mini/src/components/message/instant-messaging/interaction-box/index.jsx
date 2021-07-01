import React, { useState } from 'react';
import { View } from '@tarojs/components';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import { Emoji } from '@components/thread-post';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

const InteractionBox = (props) => {
  const { showEmoji, switchEmoji, chooseImage, typingValue, setTypingValue, doSubmitClick } = props;

  const [cursorPosition, setCursorPosition] = useState(0);

  const insertEmoji = (emoji) => {
    const text = typingValue.slice(0, cursorPosition) + emoji.code + typingValue.slice(cursorPosition);
    setTypingValue(text);
    setCursorPosition(cursorPosition + emoji.code.length);
  };

  return (
    <View id='operation-box' className={styles.interactionBox}>
      <View className={styles.operationBox}>
        <View className={styles.inputWrapper}>
          <Input
            placeholderClass={styles.placeholderClass}
            cursorSpacing={16}
            cursor={cursorPosition}
            value={typingValue}
            placeholder=" 请输入内容"
            onChange={(e) => {
              setTypingValue(e.detail.value);
              setCursorPosition(e.detail.cursor);
            }}
            onBlur={(e) => {
              setCursorPosition(e.detail.cursor);
            }}
          />
          <View className={styles.tools}>
            <View>
              <Icon name="SmilingFaceOutlined" size={20} color={'var(--color-text-secondary)'} onClick={() => {switchEmoji(!showEmoji)}} />
            </View>
            <View className={styles.pictureUpload}>
              <Icon name="PictureOutlinedBig" size={20} color={'var(--color-text-secondary)'} onClick={chooseImage} />
            </View>
          </View>
        </View>
        <View className={styles.submit}>
          <Button className={styles.submitBtn} type="primary" onClick={doSubmitClick}>
            发送
          </Button>
        </View>
      </View>
      <View className={styles['emoji-container']}>
        <Emoji show={showEmoji} onClick={insertEmoji} />
      </View>
    </View>
  );
};

export default inject('message', 'user', 'threadPost', 'site')(observer(InteractionBox));
