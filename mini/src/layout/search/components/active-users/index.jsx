import React, { useCallback } from 'react';
import Avatar from '@components/avatar';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 活跃用户
 * @prop {{id:string, image:string, name: string}[]} data 用户数据
 * @prop {function} onItemClick 用户点击事件
 */
const ActiveUsers = ({ data, onItemClick }) => (
  <View className={styles.list}>
    {data.length > 0
      && Array(Math.ceil(data.length / 5))
        .fill('')
        .map((v, rowIndex, rowArr) => (
          <View key={rowIndex} className={`${styles.itemRow} ${rowIndex === rowArr.length - 1 ? styles.lastRow : ''}`}>
            {Array(5)
              .fill('')
              .map((v, index) => {
                const prevIndex = rowIndex * 5;
                const user = data[index + prevIndex];
                if (!user) return null;
                return <User key={index} data={user} onClick={onItemClick} />;
              })}
          </View>
        ))}
  </View>
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
    <View className={styles.item} onClick={click}>
      <Avatar className={styles.avatar} image={data.avatar} name={data.username} />
      <View className={styles.name}>{data.username || ''}</View>
    </View>
  );
};

export default React.memo(ActiveUsers);
