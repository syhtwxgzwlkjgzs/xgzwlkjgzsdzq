import React from 'react';
import NoticeItem from '@components/message/notice-item';
import List from '@components/list';
import styles from './index.module.scss';

const Index = ({ list, noMore, topCard, onScrollBottom, ...other }) => {

  return (
    <div className={styles.wrapper}>
      <List
        wrapperClass={styles['list__inner']}
        height={'auto'}
        noMore={noMore}
        onRefresh={onScrollBottom}
      >
        {topCard}
        {list.map(item => <NoticeItem key={item.id} item={item} {...other} />)}
      </List>
    </div>
  )
}

export default Index
