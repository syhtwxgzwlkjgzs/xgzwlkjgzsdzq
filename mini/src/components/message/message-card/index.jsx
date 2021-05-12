import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';
import { Badge, Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';

import styles from './index.module.scss';

const MessageCard = (props) => {
  const { cardItems, redirectCallback } = props;

  return (
    <View className={styles.container}>
      {cardItems.map(({ iconName, title, link, totalCount }, idx) => (
        <View key={idx} className={styles.notificationItem} onClick={() => redirectCallback(link)}>
          {totalCount > 0 ? (
            <View className={styles.iconWrapper}>
              <Icon name={iconName} className={styles.icon} size={20} />
              <Badge info={totalCount > 99 ? '99+' : `${totalCount || '0'}`} className={styles.badge} />
            </View>
          ) : (
            <Icon name={iconName} className={styles.icon} size={20} />
          )}
          <View className={styles.title}>{title}</View>
          <View className={styles.arrow}>
            <Icon name={'RightOutlined'} className={styles.rightArrow} size={10} />
          </View>
        </View>
      ))}
    </View>
  );
};

MessageCard.propTypes = {
  cardItems: PropTypes.array.isRequired,
  redirectCallback: PropTypes.func.isRequired,
};

// 设置props默认类型
MessageCard.defaultProps = {
  cardItems: [
    {
      iconName: '',
      title: '',
      link: '',
      totalCount: 0,
    },
  ],
  redirectCallback: (link) => {
    Router.push({ url: link });
  },
};

export default MessageCard;
