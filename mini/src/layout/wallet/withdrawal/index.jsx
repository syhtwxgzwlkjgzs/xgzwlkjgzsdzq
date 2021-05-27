import React from 'react';
import { inject, observer } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import { View } from '@tarojs/components';

import MoneyInput from './components/money-input';

import styles from './index.module.scss';



@observer
class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.withdrawalAmount = null;
  }

  // 获得输入的提现金额
  getmoneyNum = (data) => {
    if (Number(data) >= 1) {
      this.withdrawalAmount = data;
    } else {
      this.withdrawalAmount = null;
    }
  }

  // 提现到微信钱包
  moneyToWeixin = () => {
    if (!this.withdrawalAmount) return;
    console.log('提现的金额', this.withdrawalAmount);
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
        <View className={styles.container}>
          <View className={styles.main}>
            <View className={styles.totalAmount}>
                <View className={styles.moneyTitle}>当前总金额</View>
                <View className={styles.moneyNum}>11866.12</View>
            </View>
            <View className={styles.moneyInput}>
              <MoneyInput getmoneyNum={data => this.getmoneyNum(data)} visible={this.state.visible} />
            </View>
          </View>
            <View className={styles.footer}>
              <Button
                type='primary'
                className={styles.button}
                onClick={() => this.moneyToWeixin()}
              >
                提现到微信钱包
              </Button>
            </View>
        </View>
    );
  }
}

export default Withdrawal;
