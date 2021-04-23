
/**
 * 发帖页底部分类、图片等工具栏
 */
import React, { useState, memo } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { attachIcon } from '@common/constants/const';
import Tag from '@components/thread-post/tag';

const Index = inject('site', 'threadPost')(observer((props) => {
  const { site, threadPost, clickCb } = props;
  console.log(site, threadPost);

  // 控制插件icon的显示/隐藏
  const [plusShow, setPlusShow] = useState(false);
  // 设置当前选中的插件
  const [currentPlus, setCurrentPlus] = useState({});

  // 插件icon元素
  const plus = attachIcon.map((item, index) => {
    return (
      <Icon
        key={index}
        className={styles['plus-icon']}
        onClick={() => {
          setCurrentPlus(item);
          clickCb(item);
        }}
        name={item.name}
        color={item.name === currentPlus.name && item.active}
        size='20'
      />
    );
  });

  // 分类元素
  const category = (
    <>
      <Icon name="SettingOutlined" size='20' className={styles['icon']} />
      <Text>分类</Text>
      <Tag content='使用交流\DZQ使用' clickCb={() => {
        // 处理分类弹框等逻辑
      }} />
    </>
  );

  return (
    <View className={styles['container']}>
      <View className={styles['category']}>
        { plusShow ? plus : category }
      </View>
      <View onClick={() => {setPlusShow(!plusShow);}}>
        { (!plusShow) && (<Icon name={currentPlus.name || 'PictureOutlinedBig'} size='20' />) }
        <Icon name="MoreBOutlined" size='20' />
      </View>
    </View>
  );
}));

export default memo(Index);
