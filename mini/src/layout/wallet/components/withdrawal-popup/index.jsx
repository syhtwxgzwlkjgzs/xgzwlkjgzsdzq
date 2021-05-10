
import React, { useState } from 'react';
import { Popup, Icon, Button } from '@discuzq/design';
import { View } from '@tarojs/components';

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
      position="bottom"
      visible={visible}
      onClose={onClose}
    >
      <View className={styles.container}>
        <View className={styles.header}>
          <View></View>
          <View className={styles.title}>提现</View>
          <View onClick={onClose}>
            <Icon name='CloseOutlined' size='12' color='#8490a8'></Icon>
          </View>
        </View>
        <View className={styles.availableAmount}>
          <View className={styles.text}>可提现金额</View>
          <View className={styles.moneyNum}>{props.moneyNumber}</View>
        </View>
        <View className={styles.moneyInput}>
          <MoneyInput getmoneyNum={data => getmoneyNum(data)} visible={visible}></MoneyInput>
        </View>
        <View className={styles.button}>
          <Button type='primary' onClick={onMoneyToWixin}>提现到微信钱包</Button>
        </View>
      </View>
    </Popup>);
};

export default WithdrawalPop;
