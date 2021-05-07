import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Button } from '@discuzq/design';
import { View } from '@tarojs/components';

const Index = inject('site')(observer(() => {
  const test = () => {};

  return (
    <View className={styles.container}>
      <Button onClick={test}>mini test</Button>
    </View>
  );
}));

export default Index;
