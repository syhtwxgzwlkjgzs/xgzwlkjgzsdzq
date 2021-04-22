import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

export default inject('site', 'threadPost')(observer((props) => {
  const { site, threadPost } = props;


  console.log(site, threadPost);


  return (
    <View className={styles['container']}>
      <View>
        <Icon name="SettingOutlined" size={'small'} />
        <Text>分类</Text>
      </View>
      <View></View>
      <View>
        <Icon name="PictureOutlinedBig" size={'small'} />
        <Icon name="MoreBOutlined" size={'small'} />
      </View>
    </View>
  );
}));
