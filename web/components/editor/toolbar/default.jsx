import React, { useState } from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import { defaultIcon } from '../const';

export default function DefaultToolbar(props) {
  const { children, onClick, onSubmit } = props;
  const [currentAction, setCurrentAction] = useState('');

  return (
    <div className={styles['dvditor-toolbar']}>
      <div className={styles['dvditor-toolbar__left']}>
        {defaultIcon.map(item => (
          <Icon key={item.name}
            onClick={() => {
              setCurrentAction(item.name);
              onClick(item);
            }}
            className={styles['dvditor-toolbar__item']}
            name={item.name}
            color={item.name === currentAction && item.active}
            size="20">
          </Icon>
        ))}
      </div>
      <div className={styles['dvditor-toolbar__right']} onClick={onSubmit}>发布</div>
      {/* 表情 */}
      {children}
    </div>
  );
}
