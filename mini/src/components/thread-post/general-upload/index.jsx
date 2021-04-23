
/**
 * 通用上传组件、支持图片、附件、视频等的上传和展示
 */
import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import { Units } from '@components/common';
import styles from './index.module.scss';

export default inject('threadPost')(observer((props) => {

  // 进行附件上传
  const atta = (
    <>
      <Units type='atta' filename='委托书.doc' size='16KB' />
      <Units type='atta-upload' />
    </>
  );

  // 进行图片上传
  const img = (
    <View className={styles['img-container']}>
      <Units className={styles['margin']} type='img' src="https://fengyuanchen.github.io/viewerjs/images/thumbnails/tibet-6.jpg" />
      <Units type='img' src="https://fengyuanchen.github.io/viewerjs/images/thumbnails/tibet-6.jpg" />
      <Units className={styles['margin']} type='img' src="https://fengyuanchen.github.io/viewerjs/images/thumbnails/tibet-6.jpg" />
      <Units type='img-upload' />
    </View>
  );

  return (
    <>
      {atta}
      {img}
    </>
  );
}));
