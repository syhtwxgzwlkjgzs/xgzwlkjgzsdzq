import React, { useState, useEffect } from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import { defaultIcon, defaultOperation } from '@common/constants/const';

export default function DefaultToolbar(props) {
  const { children, onClick, onSubmit, value } = props;
  const [currentAction, setCurrentAction] = useState('');

  useEffect(() => {
    if (!value) setCurrentAction(value);
  }, [value]);

  function handleClick() {
    if (defaultOperation.emoji === currentAction) {
      setCurrentAction('');
      onClick({ id: '' });
    }
  }

  useEffect(() => {
    window.document.body.addEventListener('click', handleClick);

    return () => {
      window.document.body.removeEventListener('click', () => handleClick);
    };
  }, []);

  return (
    <div className={styles['dvditor-toolbar']}>
      <div className={styles['dvditor-toolbar__left']}>
        {defaultIcon.map(item => (
          <Icon key={item.name}
            onClick={(e) => {
              e.stopPropagation();
              if (item.id === currentAction) {
                setCurrentAction('');
                onClick({ id: '' });
              } else {
                setCurrentAction(item.id);
                onClick(item);
              }
            }}
            className={styles['dvditor-toolbar__item']}
            name={item.name}
            color={item.id === currentAction && item.active}
            size="20">
          </Icon>
        ))}
      </div>
      <div className={styles['dvditor-toolbar__right']}
        onClick={() => {
          onSubmit();
          setCurrentAction('');
        }}
      >
        发布
      </div>
      {/* 表情 */}
      {children}
    </div>
  );
}
