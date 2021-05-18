import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Page from '@components/page';
import Message from '@layout/message';
import { getCurrentInstance } from '@tarojs/taro';

/**
* 消息页面当前显示的消息模块
*
* 从当前路由 params参数中取值page、subPage、dialogId
* page=index: 消息首页
* page=thread: 帖子通知，subPage=at/reply/like为贴子通知下@我的、回复我的、点赞我的3个子页面
* page=financial: 财务通知
* page=account: 账号消息
* page=chat: 聊天对话，dialogId=xxx为当前对话id，username为聊天对方的用户名
*
*/
const Index = inject('message')(observer(({ message }) => {
  // 路由
  const { router } = getCurrentInstance();

  // 参数过滤
  const params = (({ page, subPage, dialogId, username }) => {
    if (!['index', 'thread', 'financial', 'account', 'chat'].includes(page)) {
      page = 'index';
    }

    if (!['at', 'reply', 'like'].includes(subPage)) {
      subPage = '';
    }

    return { page, subPage, dialogId, username };
  })(router.params);

  // 更新未读消息
  useEffect(() => {
    message.readUnreadCount();
  });

  console.log('params :>> ', params);

  return (
    <Page>
      <Message {...params} />
    </Page>
  );
}));

export default Index;