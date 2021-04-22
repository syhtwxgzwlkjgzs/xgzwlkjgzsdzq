
/**
 * 发帖页底部分类、图片等工具栏
 */
import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { attachIcon } from '@common/constants//const';

export default inject('site', 'threadPost')(observer((props) => {
  const { site, threadPost } = props;
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
        onClick={() => {setCurrentPlus(item)}}
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
      <Text className={styles['content']}>使用交流\DZQ使用</Text>
    </>
  );

  return (
    <View className={styles['container']}>
      <View className={styles['category']}>
        { plusShow ? plus : category }
      </View>
      <View onClick={() => {setPlusShow(!plusShow);}}>
        { (!plusShow) && (<Icon name="PictureOutlinedBig" size='20' />) }
        <Icon name="MoreBOutlined" size='20' />
      </View>
    </View>
  );
}));
