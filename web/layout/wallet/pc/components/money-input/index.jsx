
import React, { useEffect, useState } from 'react';
import { Input, Button } from '@discuzq/design';
import styles from './index.module.scss';

const MoneyInput = (props) => {
  const { onSubmit } = props;

  const [value, setValue] = useState('');

  return (
    <div className={styles.container}>
     <div className={styles.header}>提现金额</div>
     <div className={styles.input}>
       <span className={styles.moneyIcon}>￥</span>
        <Input
          value={value}
          placeholder="0.00"
          onChange={e => setValue(e.target.value)}
          mode='number'
        />
     </div>
     <div className={styles.leastMoney}>提现金额最低1元</div>
     <div className={styles.button}>
      <Button type='primary'>提现到微信钱包</Button>
     </div>
    </div>);
};

export default MoneyInput;
