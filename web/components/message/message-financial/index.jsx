import React, { memo, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { PullDownRefresh } from '@discuzq/design';

import Notice from '@components/message/notice';

import styles from './index.module.scss';

const FinancialIndex = ({ message }) => {
  const { readDialogMsgList, dialogMsgList, createDialogMsg } = message;

  useEffect(() => {
    console.log(message);
  }, []);

  const handleDelete = () => {
    return true;
  };

  return (
    <div className={styles.wrapper}>
      <div>this is financial</div>
      <Notice list={[]} type={'financial'} onBtnClick={handleDelete} />
    </div>
  );
};

export default inject('message')(observer(FinancialIndex));
