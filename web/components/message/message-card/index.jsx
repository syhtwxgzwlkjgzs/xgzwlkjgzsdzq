import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon } from '@discuzq/design';

import styles from './index.module.scss';

const MessageCard = (props) => {
  const { cardItems, onClick } = props;
  return (
    <div className={styles.container}>
      {cardItems.map(({ iconName, title, link, totalCount }, idx) => (
        <div key={idx} className={styles.item} onClick={() => onClick(link)}>
          <div className={styles.left}>
            <Badge info={totalCount > 99 ? '99+' : totalCount || null}>
              <Icon name={iconName} className={styles.icon} size={20} />
            </Badge>
          </div>
          <div className={styles.center}>{title}</div>
          <div className={styles.arrow}>
            <Icon className={styles.right} name={'RightOutlined'} size={10} />
          </div>
        </div>
      ))}
    </div>
  );
};

MessageCard.propTypes = {
  cardItems: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

// 设置props默认类型
MessageCard.defaultProps = {
  cardItems: [],
  onClick: () => { },
};

export default MessageCard;
