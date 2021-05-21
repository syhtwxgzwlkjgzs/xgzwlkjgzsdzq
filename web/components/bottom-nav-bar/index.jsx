import React, { useState, useCallback } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { withRouter } from 'next/router';

/**
 * BottomNavBar组件
 * @prop {boolean} placeholder 固定在底部时，是否在标签位置生成一个等高的占位元素
 * @prop {boolean} curr 常亮icon
 */

const BottomNavBar = ({ router, fixed = true, placeholder = false, curr = 'home' }) => {

  const checkCurrActiveTab = useCallback((curr, target) => {
    return curr === target;
  }, [curr])

  const [tabs, setTabs] = useState([
    { icon: 'HomeOutlined', text: '首页', active: checkCurrActiveTab(curr, 'home'), router: '/' },
    { icon: 'FindOutlined', text: '发现', active: checkCurrActiveTab(curr, 'search'), router: '/search' },
    { icon: 'PlusOutlined', router: '/thread/post' },
    { icon: 'MailOutlined', text: '消息', active: checkCurrActiveTab(curr, 'message'), router: '/' },
    // { icon: 'MailOutlined', text: '消息', active: checkCurrActiveTab(curr, 'message'), router: '/message' },
    { icon: 'ProfessionOutlined', text: '我的', active: checkCurrActiveTab(curr, 'my'), router: '/my' },
  ]);

  const handleClick = (i, idx) => {
    const temp = [...tabs];
    if (i.text) {
      temp.find(i => i.active).active = false;
      temp[idx].active = true;
      setTabs(temp);
    }
    router.push(i.router);
  };

  return (
    <>
    <div className={styles.footer} style={{ position: fixed ? 'fixed' : '' }}>
      {tabs.map((i, idx) => (i.text ? (
          <div key={idx} className={styles.item + (i.active ? ` ${styles.active}` : '')} onClick={() => handleClick(i, idx)}>
            <Icon name={i.icon} size={20} />
            <div className={styles.text}>{i.text}</div>
          </div>
      ) : (
          <div key={idx} style={{ flex: 1, textAlign: 'center' }} onClick={() => handleClick(i, idx)}>
            <div className={styles.addIcon}>
              <Icon name={i.icon} size={28} color="#fff" />
            </div>
          </div>
      )))}
    </div>
    {
      fixed && placeholder && (
        <div className={styles.placeholder} />
      )
    }
    </>
  );
};

export default withRouter(BottomNavBar);
