import React, { useState, useCallback } from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { noop } from '@components/thread/utils';
import { View } from '@tarojs/components';
import Router from '@discuzq/sdk/dist/router';


/**
 * BottomNavBar组件
 * @prop {boolean} placeholder 固定在底部时，是否在标签位置生成一个等高的占位元素
 * @prop {boolean} curr 常亮icon
 */

const BottomNavBar = ({ router, fixed = true, placeholder = false, curr = 'home', onClick = noop }) => {

  const checkCurrActiveTab = useCallback((curr, target) => {
    return curr === target;
  }, [curr])

  const [tabs, setTabs] = useState([
    { icon: 'HomeOutlined', text: '首页', active: checkCurrActiveTab(curr, 'home'), router: '/pages/index/index' },
    { icon: 'FindOutlined', text: '发现', active: checkCurrActiveTab(curr, 'search'), router: '/subPages/search/index' },
    { icon: 'PlusOutlined', router: '/subPages/thread/post/index' },
    { icon: 'MailOutlined', text: '消息', active: checkCurrActiveTab(curr, 'message'), router: '/subPages/message/index' },
    { icon: 'ProfessionOutlined', text: '我的', active: checkCurrActiveTab(curr, 'my'), router: '/subPages/my/index' },
  ]);

  const handleClick = (i, idx) => {
    onClick(i, idx)
    const temp = [...tabs];
    if (i.text) {
      temp.find(i => i.active).active = false;
      temp[idx].active = true;
      setTabs(temp);
    }
    Router.push({url: i.router});
  };

  return (
    <>
    <View className={styles.footer} style={{ position: fixed ? 'fixed' : '' }}>
      {tabs.map((i, idx) => (i.text ? (
          <View key={idx} className={styles.item + (i.active ? ` ${styles.active}` : '')} onClick={() => handleClick(i, idx)}>
            <Icon name={i.icon} size={i.icon === 'MailOutlined' ? 22 : 20} />
            <View className={styles.text}>{i.text}</View>
          </View>
      ) : (
          <View key={idx} style={{ flex: 1, textAlign: 'center' }} onClick={() => handleClick(i, idx)}>
            <View className={styles.addIcon}>
              <Icon name={i.icon} size={28} color="#fff" />
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

export default BottomNavBar;
