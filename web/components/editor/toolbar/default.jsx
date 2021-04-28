import React, { useState, useEffect } from 'react';
import { Icon, Dropdown } from '@discuzq/design';
import styles from './index.module.scss';
import { defaultIcon, defaultOperation } from '@common/constants/const';

export default function DefaultToolbar(props) {
  const { children, onClick, onSubmit, value, pc } = props;
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

  const icons = (
    <>
      {defaultIcon.map((item) => {
        const iconItem = (
          <Icon key={item.name}
            onClick={(e) => {
              if (!item.menu) e.stopPropagation();
              if (item.id === currentAction) {
                setCurrentAction('');
                if (!item.menu) onClick({ id: '' });
              } else {
                setCurrentAction(item.id);
                if (!(pc && item.menu)) onClick(item);
              }
            }}
            className={styles['dvditor-toolbar__item']}
            name={item.name}
            color={item.id === currentAction && item.active}
            size="20">
          </Icon>
        );
        if (pc && item.menu) {
          const menus = (
            <Dropdown.Menu>
              {(item.menu.map(elem => (<Dropdown.Item key={elem.id} id={elem.name}>{elem.name}</Dropdown.Item>)))}
            </Dropdown.Menu>
          );
          return (
            <Dropdown
              key={item.id}
              trigger="click"
              menu={menus}
              arrow={false}
              onChange={(key) => {
                setCurrentAction('');
                onClick(item, { id: key });
              }}
            >
              {iconItem}
            </Dropdown>
          );
        }
        return iconItem;
      })}
    </>
  );

  if (pc) return (
    <div className={`${styles['dvditor-toolbar']} ${styles.pc}`}>
      {icons}
      {children}
    </div>
  );

  return (
    <div className={styles['dvditor-toolbar']}>
      <div className={styles['dvditor-toolbar__left']}>
        {icons}
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
