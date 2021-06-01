import React from 'react';
import List from '@components/list';
import MessageHeader from './message-header';
import NoticeItem from '@components/message/notice-item';
import styles from './index.module.scss';
import { sidebarData } from '@common/constants/message';

const Index = ({ infoIdx, totalCount, list, noMore, topCard, onScrollBottom, ...other }) => {

  return (
    <div className={styles.wrapper}>
      <List
        className={styles.list}
        wrapperClass={styles['list__inner']}
        noMore={noMore}
        onRefresh={onScrollBottom}
        immediateCheck={false}
      >
        <MessageHeader info={sidebarData[infoIdx]} totalCount={totalCount} />
        {topCard}
        {list.map(item => <NoticeItem key={item.id} item={item} {...other} />)}
      </List>
    </div>
  )
}

export default Index
