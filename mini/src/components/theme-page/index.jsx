import React from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

export default inject('site')(observer((props) => {
  const { children, site } = props;


  return (
    <View className={`${styles['dzq-page']} dzq-theme-${site.theme}`}>
      {children}
    </View>
  );
}));
