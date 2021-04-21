import React, { useState } from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { withRouter } from 'next/router';

const Tabbar = (props) => {
  const [tabs, setTabs] = useState([
    { icon: 'HomeOutlined', text: '首页', active: true, router: '/index' },
    { icon: 'FindOutlined', text: '发现', active: false, router: '/search' },
    { icon: 'PlusOutlined' },
    { icon: 'MessageOutlined', text: '消息', active: false, router: '/' },
    { icon: 'ProfessionOutlined', text: '我', active: false, router: '/my' },
  ]);

  const handleClick = (i, idx) => {
    const temp = [...tabs];
    if (i.text) {
      temp.find(i => i.active).active = false;
      temp[idx].active = true;
      setTabs(temp);
    }
    props.router.push(i.router);
  };

  return (
    <div className={styles.footer}>
      {tabs.map((i, idx) => (i.text ? (
          <div key={idx} className={styles.item + (i.active ? ` ${styles.active}` : '')} onClick={() => handleClick(i, idx)}>
            <Icon name={i.icon} size={20} />
            <div className={styles.text}>{i.text}</div>
          </div>
      ) : (
          <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
            <div className={styles.addIcon}>
              <Icon name={i.icon} size={24} color="#fff" />
            </div>
          </div>
      )))}
    </div>
  );
};

export default withRouter(Tabbar);
