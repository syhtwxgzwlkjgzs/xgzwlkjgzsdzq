import React from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import Button from '@discuzq/design/dist/components/button/index';
import Header from '@components/header';
import { View, Text, Image } from '@tarojs/components';
import Taro, { getLaunchOptionsSync } from '@tarojs/taro';

import error from '../../../../web/public//dzq-img/error.png';

export default function ErrorPage() {

  const onReflush = ()=>{
    Taro.navigateBack({
      delta: 1
    });
  }

  return (
    <View className={styles.page}>
      {/* <Header></Header> */}

      <View className={styles.body}>
      <Image className={styles.icon} src={error}/>
      <Text className={styles.text}>服务器错误 SERVER ERROR</Text>
      </View>

      <View className={styles.footer}>
      <Button onClick={onReflush} className={styles.button} type='primary'>点我刷新</Button>
      </View>
    </View>
  );
}
