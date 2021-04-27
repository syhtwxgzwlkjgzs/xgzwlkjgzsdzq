
/**
 * 发帖页底部表情、话题、发布等工具栏
 */
import React, { useState, memo } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { defaultIcon } from '@common/constants/const';

const Index = inject('site', 'threadPost')(observer(({ onPluginClick, onSubmit }) => {
  const [currentTool, setCurrentTool] = useState({});

  // 工具栏icon元素
  const plus = defaultIcon.map((item, index) => {
    return (
      <Icon
        key={index}
        className={styles['plus-icon']}
        onClick={() => {
          setCurrentTool(item);
          onPluginClick(item);
        }}
        name={item.name}
        color={item.id === currentTool.id && item.active}
        size='20'
      />
    );
  });

  return (
    <View className={styles['container']}>
      <View>{plus}</View>
      <Text onClick={() => {
        onSubmit();
        setCurrentTool({});
      }}>发布</Text>
    </View>
  );
}));

export default memo(Index);
