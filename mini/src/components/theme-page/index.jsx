import React from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import './index.scss';

export default inject('app')(observer((props) => {
  const { children, app } = props;


  return (
    <View className={`dzq-page dzq-theme-${app.theme}`}>
      {children}
    </View>
  );
}));
