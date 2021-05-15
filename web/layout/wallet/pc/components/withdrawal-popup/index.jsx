
import React, { useState } from 'react';
import { Popup } from '@discuzq/design';
import { Icon, Button } from '@discuzq/design';

import styles from './index.module.scss';

import MoneyInput from '../money-input';

const WithdrawalPop = (props) => {
  const { visible, onClose, moneyToWixin } = props;

  const [data, setData] = useState('');

  const getmoneyNum = (data) => {
    // console.log(data);
    if (Number(data) >= 1) {
      setData(data);
    } else {
      setData('');
    }
  };

  // 点击提现到微信钱包
  const onMoneyToWixin = () => {
    moneyToWixin(data);
    setData('');
  };

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
            <Icon name='CloseOutlined' size='12' color='#8590a6'></Icon>
          </div>
        </div>
        <div className={styles.availableAmount}>
          <div className={styles.text}>可提现金额</div>
          <div className={styles.moneyNum}>{props.moneyNumber}</div>
        </div>
        <div className={styles.moneyInput}>
          <MoneyInput getmoneyNum={data => getmoneyNum(data)} visible={visible}></MoneyInput>
        </div>
        <div className={styles.button}>
          <Button type='primary' onClick={onMoneyToWixin}>提现到微信钱包</Button>
        </div>
      </div>
    </Popup>);
};

export default WithdrawalPop;
