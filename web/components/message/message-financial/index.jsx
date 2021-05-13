import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import Notice from '@components/message/notice';

import styles from './index.module.scss';

const FinancialIndex = ({ message }) => {
  const { readFinancialMsgList } = message;
  const [financialList, setFinancialList] = useState([]);

  useEffect(async () => {
    await readFinancialMsgList();
    setFinancialList([...message.financialMsgList.list]);
  }, []);

  const handleDelete = (item) => {
    message.deleteMsg(item.id, 'financialMsgList');
  };

  const formatFinancialList = (list) => {
    const newList = [];
    list.forEach(({ amount, content, createdAt, id, threadId, type, userAvatar, userId, username }) => {
      const newItem = { amount, content, createdAt, id, threadId, type, userAvatar, userId, username };
      newList.push(newItem);
    });

    return newList;
  };

  // console.log(formatFinancialList(financialList));
  console.log(message);

  return (
    <div className={styles.wrapper}>
      <Notice list={formatFinancialList(financialList)} type={'financial'} onBtnClick={handleDelete} />
    </div>
  );
};

export default inject('message')(observer(FinancialIndex));
