
import React, { useState, useEffect } from 'react';
import { Input } from '@discuzq/design';
import styles from './index.module.scss';

const MoneyInput = (props) => {
  const { getmoneyNum, visible, minmoney = 1 } = props;

  const [value, setValue] = useState('');

  const onChange = (data) => {
    const datas = data.match(/([1-9]\d{0,9}|0)(\.\d{0,2})?/);
    setValue(datas ? datas[0] : '');
    getmoneyNum(datas ? datas[0] : '');
  };

  useEffect(() => {
    setValue('');
  }, [visible]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>提现金额</div>
      <div className={styles.input}>
        <span className={styles.moneyIcon}>￥</span>
        <Input
          className={value == 0.00 ? '' : styles.InputColor}
          value={value}
          placeholder="0.00"
          onChange={e => onChange(e.target.value)}
          mode='number'
        />
      </div>
      <div className={styles.leastMoney}>提现金额最低{minmoney}元</div>
    </div>);
};

export default MoneyInput;
