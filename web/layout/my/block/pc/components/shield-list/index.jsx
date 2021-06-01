import React, { useCallback } from 'react';
import Avatar from '@components/avatar';
import { Button } from '@discuzq/design';
import styles from './index.module.scss';

/**
 * 活跃用户
 * @prop {{id:string, image:string, name: string}[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const ShieldList = ({ data = [], onItemClick }) => (
  <div className={styles.list}>
    {data?.map((item, index) => (
      <User key={index} data={item} onClick={onItemClick} />
    ))}
  </div>
);

/**
 * 用户组件
 * @prop {object} data 用户数据
 * @prop {function} onClick 解除屏蔽点击事件
 */
const User = ({ data, onClick }) => {
  const click = useCallback(() => {
    onClick && onClick(data);
  }, [data, onClick]);

  return (
    <div className={styles.item} onClick={click}>
      <div className={styles.avatar}>
        <Avatar image={data.avatar} name={data.nickname} isShowUserInfo userId={data.pid} />
      </div>
      <div className={styles.content}>
        <div className={styles.name}>{data.nickname || ''}</div>
        <Button className={styles.button}>解除屏蔽</Button>
      </div>
    </div>
  );
};

export default React.memo(ShieldList);
