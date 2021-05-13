import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';

import styles from './index.module.scss';

const MessageCard = (props) => {
  const { cardItems, redirectCallback } = props;
  return (
    <div className={styles.container}>
      {cardItems.map(({ iconName, title, link, totalCount }, idx) => (
        <div key={idx} className={styles.notificationItem} onClick={() => redirectCallback(link)}>
          {totalCount > 0 ? (
            <div className={styles.iconWrapper}>
              <Icon name={iconName} className={styles.icon} size={20} />
              <Badge info={totalCount > 99 ? '99+' : totalCount || null} className={styles.badge} />
            </div>
          ) : (
            <Icon name={iconName} className={styles.icon} size={20} />
          )}
          <div className={styles.title}>{title}</div>
          <div className={styles.arrow}>
            <Icon name={'RightOutlined'} className={styles.rightArrow} size={10} />
          </div>
        </div>
      ))}
    </div>
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
