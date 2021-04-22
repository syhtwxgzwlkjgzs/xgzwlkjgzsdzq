
/**
 * 发帖页底部分类、图片等工具栏
 */
import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { defaultIcon } from '@common/constants/const';

export default inject('site', 'threadPost')(observer((props) => {
  const { site, threadPost } = props;
  console.log(site, threadPost);

  const [currentTool, setCurrentTool] = useState({});


  // 插件icon元素
  const plus = defaultIcon.map((item, index) => {
    return (
      <Icon
        key={index}
        className={styles['plus-icon']}
        onClick={() => {setCurrentTool(item);}}
        name={item.name}
        color={item.id === currentTool.id && item.active}
        size='20'
      />
    );
  });

  return (
    <View className={styles['container']}>
      <View>{plus}</View>
      <Text>发布</Text>
    </View>
  );
}));
