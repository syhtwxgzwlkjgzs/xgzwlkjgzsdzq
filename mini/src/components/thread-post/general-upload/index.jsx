
/**
 * 通用上传组件、支持图片、附件、视频等的上传和展示
 */
import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

export default inject('threadPost')(observer((props) => {

  return (
    <View className={styles['container']}>

    </View>
  );
}));
