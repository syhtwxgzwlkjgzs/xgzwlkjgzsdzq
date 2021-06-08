import React from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Badge } from '@discuzq/design';


const Index = ({ children, unreadCount, type = '' }) => {

  // 转换未读消息数
  const getUnReadCount = (count) => {
    return count > 99 ? '99+' : (count || null);
  };

  return (
    <View
      className={classNames({
        'normal-badge': true,
        'avatar-badge': type === 'avatar',
        'special-badge': unreadCount > 9 && unreadCount < 100,
        'large-badge': unreadCount > 99,
      })}>
      <Badge circle info={getUnReadCount(unreadCount)}>
        {children}
      </Badge>
    </View>
  );
};

export default Index;
