import React from 'react';
import { Badge, Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';

import styles from './index.module.scss';


const MessageCard = (props) => {

  const { cardItems } = props;
  return (
    <div className={styles.container}>
      {cardItems.map(({ iconName, title, link, totalCount }, idx) => (
        <div key={idx} className={styles.notificationItem}>
          {totalCount > 0 ? (
            <div className={styles.iconWrapper}>
              <Icon name={iconName} className={styles.icon} size={20}/>
              <Badge info={totalCount > 99 ? '99+' : `${totalCount || '0'}`} className={styles.badge} />
            </div>
          ) : (
            <Icon name={iconName} className={styles.icon} size={20}/>
          )}
          <div className={styles.title}>{title}</div>
          <div
            className={styles.arrow}
            onClick={() => {
              Router.push({ url: link });
            }}
          >
            <Icon name={"RightOutlined"} className={styles.rightArrow} size={10}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageCard;
