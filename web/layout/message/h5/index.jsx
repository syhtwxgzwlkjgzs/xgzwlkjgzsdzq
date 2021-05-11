import React, { memo, useState, useEffect, useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import MessageAccount from '@components/message/message-account';
import MessageIndex from '@components/message/message-index';
import MessageThread from '@components/message/message-thread';
import MessageFinancial from '@components/message/message-financial';
import MessageChat from '@components/message/message-chat';

const Index = ({ page, subPage, dialogId, message }) => {
  const { readAccountMsgList, readDialogList, createDialog, dialogList, accountMsgList } = message;

  useEffect(() => {
    readAccountMsgList(1);
    // readDialogList();
    // ['fishcui1234', '18279670797', 'cjw', 'LamHo', 'yuzhihang1', 'heifeipangpang', '郝梦茹', '余努力', '网友B1r8jI', '网友hlvaHi', 'heifeipang123', '网友6HZYch', '黑哈哈', '网友4tEz2z', 'Lam', '暮光2'].forEach(item => {
    //   createDialog({
    //     recipientUsername: item,
    //     messageText: '祝您身体健康',
    //   });
    // });
  }, []);

  useMemo(() => {
    console.log(accountMsgList);
  }, [accountMsgList]);

  console.log(page);

  switch (page) {
    case 'index':
      return <MessageIndex accountMsgList={accountMsgList} />;
    case 'account':
      return <MessageAccount subPage={subPage} />;
    case 'thread':
      return <MessageThread />;
    case 'financial':
      return <MessageFinancial />;
    case 'chat':
      return <MessageChat dialogId={dialogId} />;
  }
};

export default inject('message')(observer(memo(Index)));
