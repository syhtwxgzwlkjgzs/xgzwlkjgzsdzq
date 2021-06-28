import React, { useEffect, useRef } from 'react';
import List from '@components/list';
import MessageHeader from './message-header';
import NoticeItem from '@components/message/notice-item';
import styles from './index.module.scss';
import { sidebarData } from '@common/constants/message';

const Index = ({ infoIdx, totalCount, list, noMore, topCard, onScrollBottom, ...other }) => {
  const WrapperRef = useRef(null);
  const contentRef = useRef(null);

  // 兼容PC端大屏，消息数量不够时无法主动触底
  useEffect(() => {
    if (WrapperRef.current.offsetHeight > contentRef.current.offsetHeight && list.length > 0 && !noMore) {
      onScrollBottom();
    }
  }, [list.length])

  return (
    <div className={styles.wrapper} ref={WrapperRef}>
      <List
        className={styles.list}
        wrapperClass={styles['list__inner']}
        noMore={noMore}
        onRefresh={onScrollBottom}
        immediateCheck={false}
      >
        <div ref={contentRef}>
          <MessageHeader info={sidebarData[infoIdx]} totalCount={totalCount} />
          {topCard}
          {list.map(item => <NoticeItem key={item.id} item={item} {...other} />)}
        </div>
      </List>
    </div>
  )
}

export default Index
