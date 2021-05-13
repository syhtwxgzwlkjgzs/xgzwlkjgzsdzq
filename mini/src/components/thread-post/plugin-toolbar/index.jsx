
/**
 * 发帖页底部分类、图片等工具栏
 */
import React, { useState, useMemo, memo, useCallback } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { attachIcon } from '@common/constants/const';
import { Units } from '@components/common';

const Index = inject('user', 'threadPost')(observer((props) => {
  const { threadPost, clickCb, onCategoryClick, user } = props;

  // 控制插件icon的显示/隐藏
  const [plugShow, setplugShow] = useState(false);
  // 设置当前选中的插件
  const [currentplug, setCurrentplug] = useState({});

  const content = useCallback(
    () => {
      const { parent, child } = threadPost.categorySelected;
      return `${parent.name || ''}${child.name ? ` \\ ${child.name}` : ''}`;
    },
    [threadPost.categorySelected],
  )

  // 插件icon元素
  const { threadExtendPermissions: tep } = user;
  const plug = useMemo(() => {
    return attachIcon.map((item, index) => {
      // 是否有权限
      const canInsert = tep[item.type];
      return canInsert ? (
        <Icon
          key={index}
          className={styles['plug-icon']}
          onClick={() => {
            setplugShow(false);
            setCurrentplug(item);
            clickCb(item);
          }}
          name={item.name}
          color={item.name === currentplug.name && item.active}
          size='20'
        />
      ) : null;
    });
  }, [tep, currentplug])

  // 分类元素
  const category = (
    <View className={styles['category']} onClick={onCategoryClick}>
      <Icon
        name="MenuOutlined"
        size='14'
        className={styles['icon']}
      />
      <Text>分类</Text>
      <Units type='tag' tagContent={content() || '选择分类(必选)'} onTagClick={() => {
        // 处理分类弹框等逻辑
      }} />
    </View>
  );

  return (
    <View className={styles['container']}>
      <View className={styles['category']}>
        { plugShow ? plug : category }
      </View>
      <View onClick={() => {setplugShow(!plugShow);}}>
        { (!plugShow) && (<Icon name={currentplug.name || 'PictureOutlinedBig'} size='20' />) }
        <Icon name="MoreBOutlined" size='20' />
      </View>
    </View>
  );
}));

export default memo(Index);
