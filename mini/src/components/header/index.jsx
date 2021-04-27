import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';

export default function H5Header(props) {
  const { isBackCustom } = props;
  // todo
  const iconClickHandle = useCallback((type) => {
    switch (type) {
      case 'home': Router.push({ url: '/' });
        break;
      case 'msg': Router.push({ url: '/my/notice' });
        break;
      case 'user': Router.push({ url: '/my' });
        break;
    }
  }, []);

  const gobackClickHandle = useCallback(() => {
    let isBack = true;
    if (typeof isBackCustom === 'function') isBack = isBackCustom();
    if (isBack) Router.back();
  }, []);

  return (
    <View className={styles.header}>
        <View className={styles.headerContent}>
            <View onClick={gobackClickHandle} className={styles.left}>返回</View>
            <View className={styles.right}>
                <Icon onClick={() => {
                  iconClickHandle('home');
                }} name="HomeOutlined" color="#C4C9D6" size={20} />
                <Icon onClick={() => {
                  iconClickHandle('msg');
                }} name="MessageOutlined" color="#C4C9D6" size={20} />
                <Icon onClick={() => {
                  iconClickHandle('user');
                }} name="ProfessionOutlined" color="#C4C9D6" size={20} />
            </View>
        </View>
    </View>
  );
}
