import React from 'react';
import { Avatar } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 活跃用户
 * @props {{id:string, image:string, name: string}[]} data 用户数据
 */
const ActiveUsers = ({ data }) => (
    <div className={styles.list}>
      {data.length > 0
        && Array(Math.ceil(data.length / 5))
          .fill('')
          .map((v, rowIndex, rowArr) => (
            <div key={rowIndex} className={`${styles.itemRow} ${rowIndex === rowArr.length - 1 ? styles.lastRow : ''}`}>
              {Array(5)
                .fill('')
                .map((v, index) => {
                  const prevIndex = rowIndex * 5;
                  const user = data[index + prevIndex];
                  if (!user) return null;
                  return (
                    <div key={index} className={styles.item}>
                      <Avatar className={styles.avatar} size="large" circle={true} image={user.image} />
                      <div className={styles.name}>{user.name}</div>
                    </div>
                  );
                })}
            </div>
          ))}
    </div>
);

export default React.memo(ActiveUsers);
