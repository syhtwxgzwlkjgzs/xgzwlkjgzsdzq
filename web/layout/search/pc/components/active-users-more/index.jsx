import React, { useCallback, useMemo } from 'react';
import Avatar from '@components/avatar';
import { Button, Icon } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 活跃用户
 * @prop {{id:string, image:string, name: string}[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const ActiveUsers = ({ data, onItemClick, onFollow }) => (
  <div className={styles.list}>
    {data?.map((item, index) => (
      <User key={index} data={item} onFollow={onFollow} onClick={onItemClick} />
    ))}
  </div>
);

/**
 * 用户组件
 * @prop {object} data 用户数据
 * @prop {function} onClick 用户点击事件
 */
const User = ({ data, onClick, onFollow }) => {
  const click = useCallback(() => {
    onClick && onClick(data);
  }, [data, onClick]);

  const handleFollow = () => {
    const type = btnInfo.text === '关注' ? '1' : '0'
    onFollow({ id: data.userId, type })
  }

  const btnInfo = useMemo(() => {
    if (data.isFollow) {
      return { text: '已关注', icon: 'CheckOutlined', className: styles.isFollow }
    }
    if (data.isMutualFollow) {
      return { text: '互关', icon: 'WithdrawOutlined', className: styles.withdraw }
    }
    return { text: '关注', icon: 'PlusOutlined', className: styles.follow }
  }, [data.isFollow])

  return (
    <div className={styles.item} onClick={click}>
      <div>
        <Avatar image={data.avatar} name={data.nickname} isShowUserInfo userId={data.userId} />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.name}>{data.nickname}</span>
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
            {data.followCount}
          </div>
        </div>
      </div>
      <Button type="primary" className={`${styles.button} ${btnInfo.className}`} onClick={handleFollow}>
        <Icon name={btnInfo.icon} size={12} className={styles.addIcon} />
        {btnInfo.text}
      </Button>
    </div>
  );
};

export default React.memo(ActiveUsers);
