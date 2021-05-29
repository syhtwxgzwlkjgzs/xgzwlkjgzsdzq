
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@discuzq/design';
import styles from './index.module.scss';

const MoneyInput = (props) => {
  const { getmoneyNum, visible, minmoney = 1, maxmoney, inputValue: value, updateState, onChange } = props;

  // const [value, setValue] = useState('');
  
  // const onChange = (data) => {
  //   const datas = data.match(/([1-9]\d{0,9}|0)(\.\d{0,2})?/);
  //   setValue(datas ? datas[0] : '');
  //   getmoneyNum(datas ? datas[0] : '');
  // };

  const handleChange = (data) => {
   if (typeof onChange === 'function') {
    onChange(data)
   }
  }
  
  const getColorShow = useMemo(() => {
    if (value == 0.00) {
      return ''
    } else if (parseFloat(maxmoney) < parseFloat(value)) {
      return styles.InputRedColor
    } else {
      return styles.InputColor
    }
  }, [value]
  )


  useEffect(() => {
    updateState({name: 'inputValue', value: ""});
  }, [visible]);


  return (
    <div className={styles.container}>
      <div className={styles.header}>提现金额</div>
      <div className={styles.input}>
        <span className={parseFloat(maxmoney) < parseFloat(value) ? styles['moneyIcon-Red'] : styles.moneyIcon}>￥</span>
        <Input
          className={getColorShow}
          value={value}
          placeholder="0.00"
          onChange={e => handleChange(e.target.value)}
          mode='number'
        />
      </div>
      <div className={styles.leastMoney}>
        {parseFloat(maxmoney) < parseFloat(value) &&
          <p className={styles.leasterr}>提现金额不得大于可提现金额</p>
        }
        提现金额最低{minmoney}元
        </div>
    </div>


  );
};

export default MoneyInput;
