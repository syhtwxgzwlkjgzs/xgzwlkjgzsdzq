
/**
 * 发帖页底部表情、话题、发布等工具栏
 */
import React, { useState, memo } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { defaultIcon } from '@common/constants/const';
import { defaultOperation as dOpera } from '@common/constants/const';

const Index = inject('site', 'threadPost')(observer(({ onPluginClick, onSubmit }) => {
  const [currentTool, setCurrentTool] = useState({});

  const permissionMap = {
    [dOpera.emoji]: true,
    [dOpera.at]: true,
    [dOpera.topic]: true,
    [dOpera.attach]: true,
    [dOpera.redpacket]: true,
    [dOpera.pay]: true
  };

  // 工具栏icon元素
  const plus = defaultIcon.map((item, index) => {
    // 是否有权限
    const canInsert = permissionMap[item.id];
    return canInsert ? (
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
    ) : null;
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
