import React, { useEffect, useState } from 'react';

import { Icon } from '@discuzq/design';

import styles from './index.module.scss';

export default function NoMore(props) {
  const { selectClick } = props;

  const [selected, setSelected] = useState('income');

  const onSelectClick = async (type) => {
    if (typeof selectClick === 'function') {
      try {
        const success = await selectClick(type);
        if (success) {
          setSelected(type);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.detailed}>
        <div className={styles.left}>
          <div className={`${selected === 'income' ? styles.selectedCircle : ''} ${styles.circle}`}>
            <div className={`${selected === 'income' ? styles.selectedSpot : ''} ${styles.spot}`}></div>
          </div>
          <div className={styles.linePosition}>
            <div className={styles.line}></div>
          </div>
        </div>
        <div className={styles.rigth} onClick={() => onSelectClick('income')}>
          <Icon name='EditOutlined' size='14' color='#3ac15f'></Icon>
          <span className={`${selected === 'income' ? styles.textColor : ''} ${styles.text}`}>收入明细</span>
        </div>
      </div>
      <div className={styles.detailed}>
        <div className={styles.left}>
          <div className={`${selected === 'pay' ? styles.selectedCircle : ''} ${styles.circle}`}>
            <div className={`${selected === 'pay' ? styles.selectedSpot : ''} ${styles.spot}`}></div>
          </div>
        </div>
        <div className={styles.rigth} onClick={() => onSelectClick('pay')}>
          <Icon name='EditOutlined' size='14' color='#2469f6'></Icon>
          <span className={`${selected === 'pay' ? styles.textColor : ''} ${styles.text}`}>支出明细</span>
        </div>
      </div>
      <div className={styles.detailed}>
        <div className={styles.left}>
          <div className={`${selected === 'withdrawal' ? styles.selectedCircle : ''} ${styles.circle}`}>
            <div className={`${selected === 'withdrawal' ? styles.selectedSpot : ''} ${styles.spot}`}></div>
          </div>
        </div>
        <div className={styles.rigth} onClick={() => onSelectClick('withdrawal')}>
          <Icon name='EditOutlined' size='14' color='#e02433'></Icon>
          <span className={`${selected === 'withdrawal' ? styles.textColor : ''} ${styles.text}`}>提现记录</span>
        </div>
      </div>
    </div>
  );
}
