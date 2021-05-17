import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { inject, observer } from 'mobx-react';

import Header from '@components/header';
import Notice from '@components/message/notice';

import styles from './index.module.scss';

const Index = ({ site, message }) => {
  const { readFinancialMsgList, financialMsgList, deleteMsg } = message;
  const { list, currentPage, totalPage } = financialMsgList;

  // 初始化
  useEffect(() => {
    fetchFinancialData(1);
  }, []);

  // 请求数据
  const fetchFinancialData = (initPage = 0) => {
    return readFinancialMsgList(initPage || currentPage + 1);
  };

  // 格式化渲染数据
  const formatFinancialList = (list = []) => {
    const newList = [];
    list.forEach(({
      amount, content, createdAt, id, threadId, type, userAvatar: avatar, userId, username
    }) => {
      newList.push({
        amount, content, createdAt, id, threadId, type, avatar, userId, username
      });
    });
    return newList;
  };

  // 监听data变化，处理数据
  const renderList = useMemo(() => {
    return formatFinancialList(list);
  }, [list])

  return (
    <div className={styles.wrapper}>
      {!site.isPC && <Header />}
      <Notice
        height='calc(100vh - 44px)'
        withTopBar={!site.isPC}
        noMore={currentPage >= totalPage}
        list={renderList}
        type='financial'
        onPullDown={() => readFinancialMsgList(1)}
        onScrollBottom={() => fetchFinancialData()}
        onBtnClick={(item) => deleteMsg(item.id, 'financialMsgList')}
      />
    </div>
  );
};

export default inject('site', 'message')(observer(Index));
