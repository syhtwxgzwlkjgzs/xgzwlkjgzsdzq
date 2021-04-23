import React, { useCallback } from 'react';
import Avatar from '@components/avatar';
import { Button, Icon } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 活跃用户
 * @prop {{id:string, image:string, name: string}[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const ActiveUsers = ({ data, onItemClick }) => (
  <div className={styles.list}>
    {data.map((item, index) => (
      <User key={index} data={item} onClick={onItemClick} />
    ))}
  </div>
);

/**
 * 用户组件
 * @prop {object} data 用户数据
 * @prop {function} onClick 用户点击事件
 */
const User = ({ data, onClick }) => {
  const click = useCallback(() => {
    onClick && onClick(data);
  }, [data, onClick]);

  return (
    <div className={styles.item} onClick={click}>
      <div>
        <Avatar image={data.avatar} name={data.username} />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.name}>{data.username}</span>
          <span className={styles.group}>{data.groupName}</span>
        </div>
        <div className={styles.num}>
          <div className={styles.numItem}>
            <span className={styles.numTitle}>主题</span>
            {data.threadCount}
          </div>
          <div className={styles.numItem}>
            <span className={styles.numTitle}>问答</span>
            {data.questionCount}
          </div>
          <div className={styles.numItem}>
            <span className={styles.numTitle}>点赞</span>
            {data.likedCount}
          </div>
          <div className={styles.numItem}>
            <span className={styles.numTitle}>关注</span>
            {data.fansCount}
          </div>
        </div>
      </div>
      <Button type="primary" className={styles.button}>
        <Icon name="PlusOutlined" size={12} className={styles.addIcon}/>
        关注
      </Button>
    </div>
  );
};

export default React.memo(ActiveUsers);
