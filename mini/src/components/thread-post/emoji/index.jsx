/**
 * 定位组件
 */
import React, { memo, useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, Text } from '@tarojs/components';

import styles from './index.module.scss';
import { Popup } from '@discuzq/design';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Taro from '@tarojs/taro';


const Index = inject('threadPost')(observer(({ threadPost, show = false, onHide }) => {
  const { fetchEmoji, emojis, postData, setPostData } = threadPost;

  useEffect(async () => {
    !emojis.length && fetchEmoji();
  }, []);

  return (
    <Popup
      position="bottom"
      visible={show}
      onClose={onHide}
      >
      <View className={styles['emoji-container']}>
        {emojis.map((item, index) => <Image className={styles['emoji-item']} key={index} src={item.url} onClick={() => {
          setPostData({
            contentText: postData.contentText + item.code
          });
          onHide();
        }} />)}
      </View>
      <View className={styles.btn} onClick={onHide}>取消</View>
    </Popup>

  );
}));

Index.propTypes = {
  /**
   * 位置变化的回调
   */
   positionChange: PropTypes.func,

   currentPosition: PropTypes.object,
};


export default memo(Index);
