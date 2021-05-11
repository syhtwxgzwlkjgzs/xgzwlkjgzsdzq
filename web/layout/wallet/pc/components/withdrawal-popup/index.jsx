
import React from 'react';
import { Popup } from '@discuzq/design';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';

import MoneyInput from '../money-input';

const WithdrawalPop = (props) => {
  const { visible, onClose } = props;

  return (
    <Popup
      position="center"
      visible={visible}
      onClose={onClose}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div></div>
          <div className={styles.title}>提现</div>
          <div onClick={onClose}>
            <Icon name='CloseOutlined' size='12' color='#8490a8'></Icon>
          </div>
        </div>
        <div className={styles.availableAmount}>
          <div className={styles.text}>可提现金额</div>
          <div className={styles.moneyNum}>11786.00</div>
        </div>
        <div className={styles.moneyInput}>
          <MoneyInput></MoneyInput>
        </div>
      </div>
    </Popup>);
};

export default WithdrawalPop;
