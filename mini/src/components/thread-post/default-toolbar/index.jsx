
/**
 * 发帖页底部表情、话题、发布等工具栏
 */
import React, { useState, useMemo, memo } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { defaultIcon } from '@common/constants/const';

const Index = inject('user')(observer(({
  user,
  onPluginClick,
  onSubmit,
}) => {
  const [currentTool, setCurrentTool] = useState({});

  // 工具栏icon元素
  const { threadExtendPermissions: tep } = user;
  const plug = useMemo(() => {
    return defaultIcon.map((item, index) => {
      // 是否有权限
      const canInsert = tep[item.id];
      return canInsert ? (
        <Icon
          key={index}
          className={styles['plug-icon']}
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
  }, [tep, currentTool])

  return (
    <View className={styles['container']}>
      <View>{plug}</View>
      <Text onClick={() => {
        onSubmit();
        setCurrentTool({});
      }}>发布</Text>
    </View>
  );
}));

export default memo(Index);
