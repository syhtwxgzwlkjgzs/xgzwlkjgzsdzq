/* eslint-disable no-param-reassign */
import React, { memo } from 'react';
import { inject, observer } from 'mobx-react';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithLogin from '@common/middleware/HOCWithLogin';
import H5Page from '@layout/message/h5';
import PCPage from '@layout/message/pc';
import { useRouter } from 'next/router';

const Index = ({ site }) => {
  const { platform } = site;

  /**
   * 消息页面当前显示模块
   *
   * 从url query参数中取值page、subPage、dialogId
   * page=index: 消息首页
   * page=thread: 帖子通知，subPage=at/reply/like为贴子通知下@我的、回复我的、点赞我的3个子页面
   * page=financial: 财务通知
   * page=account: 账号消息
   * page=chat: 聊天对话，dialogId=xxx为当前对话id
   *
  */
  const router = useRouter();
  // 参数过滤
  const params = (({ page, subPage, dialogId }) => {
    if (!['index', 'thread', 'financial', 'account', 'chat'].includes(page)) {
      page = 'index';
    }

    if (!['at', 'reply', 'like'].includes(subPage)) {
      subPage = '';
    }

    return { page, subPage, dialogId };
  })(router.query);

  if (platform === 'pc') {
    return <PCPage {...params} />;
  }
  return <H5Page {...params} />;
};


// export default HOCFetchSiteData(HOCWithLogin(memo(Index)));
export default inject('site')(observer(memo(Index)));
