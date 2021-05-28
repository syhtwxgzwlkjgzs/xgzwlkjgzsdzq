/**
 * 表情组件
 */
import React, { memo, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image } from '@tarojs/components';

import styles from './index.module.scss';
import Popup from '@discuzq/design/dist/components/popup/index';


const Index = inject('threadPost')(observer(({ threadPost, show = false, onHide }) => {
  const { fetchEmoji, emojis, postData: { contentText = '' }, setPostData, cursorPosition, setCursorPosition } = threadPost;

  useEffect(async () => {
    !emojis.length && fetchEmoji();
  }, []);

  return (
    <View className={styles['emoji-container']} style={{ display: show ? 'block' : 'none' }}>
      {emojis.map((item, index) => <Image className={styles['emoji-item']} key={index} src={item.url} onClick={() => {
        setPostData({
          contentText: contentText.slice(0, cursorPosition) + item.code + contentText.slice(cursorPosition)
        });
        setCursorPosition(cursorPosition + item.code.length);
        onHide();
      }} />)}
    </View>
  );
}));

export default memo(Index);
