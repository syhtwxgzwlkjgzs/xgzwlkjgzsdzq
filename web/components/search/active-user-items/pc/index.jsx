import React, { useCallback } from 'react';
import Avatar from '@components/avatar';

import styles from './index.module.scss';

/**
 * 活跃用户
 * @prop {{id:string, image:string, name: string}[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const ActiveUsers = ({ direction = 'right', data, onItemClick }) => {

  const click = (data) => {
    typeof onItemClick === 'function' && onItemClick(data);
  };

  return (
    <div className={styles.list}>
      {data?.map((item, index) => (
        <div key={index} className={styles.item} onClick={() => click(item)}>
          <div className={styles.avatar}>
            <Avatar direction={direction} image={item.avatar} name={item.nickname} isShowUserInfo userId={item.userId} />
          </div>
          <div className={styles.content}>
            <div className={styles.name}>{item.nickname || ''}</div>
            <div className={styles.groupName}>{item.groupName || ''}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ActiveUsers);
