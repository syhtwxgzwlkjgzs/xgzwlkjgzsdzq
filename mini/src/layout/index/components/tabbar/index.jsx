import React, { useState } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

/**
 * tabbar组件
 * @prop {boolean} placeholder 固定在底部时，是否在标签位置生成一个等高的占位元素
 */

const TabBar = ({ router, fixed = true, placeholder = false }) => {
  const [tabs, setTabs] = useState([
    { icon: 'HomeOutlined', text: '首页', active: true, router: '/pages/index' },
    { icon: 'FindOutlined', text: '发现', active: false, router: '/subPages/search/index' },
    { icon: 'PlusOutlined', router: '/subPages/thread/post/index' },
    { icon: 'MessageOutlined', text: '消息', active: false, router: '/pages/message/index' },
    { icon: 'ProfessionOutlined', text: '我', active: false, router: '/pages/my' },
  ]);

  const handleClick = (i, idx) => {
    const temp = [...tabs];
    if (i.text) {
      temp.find(i => i.active).active = false;
      temp[idx].active = true;
      setTabs(temp);
    }
    Taro.navigateTo({url: i.router });
  };

  return (
    <>
    <View className={styles.footer} style={{ position: fixed ? 'fixed' : '' }}>
      {tabs.map((i, idx) => (i.text ? (
          <View key={idx} className={styles.item + (i.active ? ` ${styles.active}` : '')} onClick={() => handleClick(i, idx)}>
            <Icon name={i.icon} size={20} />
            <View className={styles.text}>{i.text}</View>
          </View>
      ) : (
          <View key={idx} style={{ flex: 1, textAlign: 'center' }} onClick={() => handleClick(i, idx)}>
            <View className={styles.addIcon}>
              <Icon name={i.icon} size={24} color="#fff" />
            </View>
          </View>
      )))}
    </View>
    {
      fixed && placeholder && (
        <View className={styles.placeholder} />
      )
    }
    </>
  );
};

export default TabBar;
