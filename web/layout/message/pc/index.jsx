import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import MessageAccount from '@components/message/message-account';
import MessageIndex from '@components/message/message-index';
import MessageThread from '@components/message/message-thread';
import MessageFinancial from '@components/message/message-financial';
import MessageChat from '@components/message/message-chat';
import BaseLayout from '@components/base-layout';
import SidebarPanel from '@components/sidebar-panel';
import Copyright from '@components/copyright';
import UserCenterFollow from '@components/user-center-follow';
import Router from '@discuzq/sdk/dist/router';
import Stepper from '../../search/pc/components/stepper';
import { sidebarData as sidebarDataOriginal } from '@common/constants/message';

const Index = ({ page, subPage, dialogId, username, message }) => {
  const router = useRouter();

  const { threadUnread, financialUnread, accountUnread } = message;

  const [sidebarData, setSidebarData] = useState(sidebarDataOriginal);

  const [sidebarIndex, setSidebarIndex] = useState(9999);

  const mainContent = useMemo(() => {
    // 处理侧边栏选中状态
    const p = page === 'chat' ? 'index' : page;
    sidebarData.forEach((item, i) => {
      if (item.type === p) {
        console.log(i);
        setSidebarIndex(i);
      }
    });

    // 处理页面主内容切换
    switch (page) {
      case 'index':
        return <MessageIndex />;
      case 'account':
        return <MessageAccount subPage={subPage} />;
      case 'thread':
        return <MessageThread />;
      case 'financial':
        return <MessageFinancial />;
      case 'chat':
        return <MessageChat dialogId={dialogId} username={username} />;
    }
  }, [page, subPage, dialogId, username]);


  // 更新未读消息
  useEffect(() => {
    setSidebarData(sidebarData.map((item) => {
      const newItem = { ...item };
      newItem.unreadCount = message[item.unreadKeyName] || 0;
      return newItem;
    }));
  }, [threadUnread, financialUnread, accountUnread]);


  const rightContent = () => (
    <div className={styles.rightside}>
      <div className={styles['stepper-container']}>
        <Stepper onItemClick={sidebarClick} selectIndex={sidebarIndex} data={sidebarData} />
      </div>

      <SidebarPanel
        type="normal"
        isNoData={99 === 0}
        title="关注"
        leftNum={99}
        onShowMore={() => {}}
      >
        {99 !== 0 && (
          <UserCenterFollow
            style={{
              overflow: 'hidden',
            }}
            // className={styles.friendsWrapper}
            limit={5}
          />
        )}
      </SidebarPanel>
      <Copyright />
    </div>
  );;

  const sidebarClick = (_index, _iconName, item) => {
    router.replace(`/message?page=${item.type}`);
  };


  return (
    <BaseLayout
      // onSearch={this.onSearch}
      // onRefresh={this.onPullingUp}
      // noMore={currentPage >= totalPage}
      // onScroll={this.onScroll}
      // showRefresh={false}
      // left={ this.renderLeft(countThreads) }
      right={rightContent}
    >
      {mainContent}
    </BaseLayout>
  );
};

export default inject('message')(observer(Index));
