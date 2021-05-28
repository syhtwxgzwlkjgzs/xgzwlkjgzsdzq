import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import MoneyInput from './components/money-input';

import styles from './index.module.scss';

import { Icon, Button, Toast } from '@discuzq/design';

@observer
class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      minmoney: 1,
      moneyOverThanAmount: false, // 是否超过当前可提现金额
      withdrawalAmount: 0,
    };
  }

  // 获得输入的提现金额
  getmoneyNum = (data) => {
    if (Number(data) >= 1) {
      this.setState({
        withdrawalAmount: data,
      });

      if (Number(this.state.withdrawalAmount) > this.props.walletData.availableAmount) {
        this.setState({
          moneyOverThanAmount: true,
        });
      }
    } else {
      this.setState({
        withdrawalAmount: 0,
        moneyOverThanAmount: false,
      });
    }
  };

  // 提现到微信钱包
  moneyToWeixin = () => {
    if (!this.state.withdrawalAmount) {
      return Toast.warning({ content: '不得小于最低提现金额' });
    }
    console.log('提现的金额', this.state.withdrawalAmount);
    this.setState({ visible: !this.state.visible });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.totalAmount}>
            <div className={styles.moneyTitle}>可提现金额</div>
            <div className={styles.moneyNum}>{this.props.walletData?.availableAmount}</div>
          </div>
          <div className={styles.moneyInput}>
            <MoneyInput
              getmoneyNum={data => this.getmoneyNum(data)}
              visible={this.state.visible}
              minmoney={this.state.minmoney}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button type={'primary'} className={styles.button} onClick={() => this.moneyToWeixin()}>
            提现到微信钱包
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Withdrawal);
