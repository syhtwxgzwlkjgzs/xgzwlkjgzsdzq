import React from 'react';
import Button from '@discuzq/design/dist/components/button';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import error from '../../public/dzq-img/error.png';

export default function ErrorPage() {
  const onReflush = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  return (
    <View className={styles.page}>
      {/* <Header></Header> */}

      <View className={styles.body}>
        <Image className={styles.icon} src={error} />
        <Text className={styles.text}>服务器错误 SERVER ERROR</Text>
      </View>

      <View className={styles.footer}>
        <Button onClick={onReflush} className={styles.button} type="primary">
          返回上一页
        </Button>
      </View>
    </View>
  );
}
