import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { Badge, Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';

import styles from './index.module.scss';


export class CategoryList extends Component {
  state = {
    categoryItems: [
      {
        iconName: 'RemindOutlined',
        title: '帖子通知',
        link: '#',
        totalCount: 0,
      },
      {
        iconName: 'RenminbiOutlined',
        title: '财务通知',
        link: '#',
        totalCount: 11,
      },
      {
        iconName: 'LeaveWordOutlined',
        title: '账号消息',
        link: '#',
        totalCount: 100,
      },
    ],
  };

  render() {
    const { categoryItems } = this.state;
    return (
      <View className={styles.container}>
        {categoryItems.map(({ iconName, title, link, totalCount }, idx) => (
          <View key={idx} className={styles.notificationItem}>
            {totalCount > 0 ? (
              <View className={styles.iconWrapper}>
                <Icon name={iconName} className={styles.icon} size={20}/>
                <Badge info={totalCount > 99 ? '99+' : `${totalCount || '0'}`} className={styles.badge} />
              </View>
            ) : (
              <Icon name={iconName} className={styles.icon} size={20}/>
            )}
            <View className={styles.title}>{title}</View>
            <View
              className={styles.arrow}
              onClick={() => {
                Router.push({ url: link });
              }}
            >
              <Icon name={"RightOutlined"} className={styles.rightArrow} size={10}/>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

export default CategoryList;
