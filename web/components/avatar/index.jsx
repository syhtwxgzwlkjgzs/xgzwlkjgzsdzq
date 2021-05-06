import React, { useMemo } from 'react';
import { Avatar } from '@discuzq/design';
import styles from './index.module.scss';

export default function avatar(props) {
  const { image = '', name = '匿', onClick = () => {}, className = '', circle = true, size = 'primary', isShowUserInfo = false, userId = null } = props;

  const userName = useMemo(() => {
    const newName = name.toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  const userInfoBox = useMemo(() => {
    if (!isShowUserInfo || !userId) return null;
    return (
      <div className={styles.userInfoBox}>
        <div className={styles.header}>

        </div>
        <div className={styles.content}></div>
      </div>
    );
  }, [isShowUserInfo])

  if (image && image !== '') {
    return (
      <div className={styles.avatarBox}>
        <Avatar className={className} circle={circle} image={image} size={size} onClick={onClick}></Avatar>
        {userInfoBox}
      </div>
    );
  }

  return (
    <div className={styles.avatarBox}>
      <Avatar className={className} circle={circle} text={userName} size={size} onClick={onClick}></Avatar>
      {userInfoBox}
    </div>
  );
}
