import React, { Component } from 'react';
import { Avatar, Badge, Icon } from '@discuzq/design';

import styles from './index.module.scss';


export class CategoryList extends Component {
  state = {
    categoryContent: [
      {
        iconName: 'RemindOutlined',
        title: '帖子通知',
        link: '/',
        totalCount: 0,
      },
      {
        iconName: 'RenminbiOutlined',
        title: '财务通知',
        link: '/',
        totalCount: 11,
      },
      {
        iconName: 'LeaveWordOutlined',
        title: '账号消息',
        link: '/',
        totalCount: 100,
      },
    ],
  };

  render() {
    const { categoryContent } = this.state;
    return (
      <div className={styles.container}>
        {categoryContent.map(({ iconName, title, link, totalCount }, idx) => (
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
}

export default CategoryList;
