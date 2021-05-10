import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import MoneyInput from './components/money-input';

import styles from './index.module.scss';

import { Icon, Button } from '@discuzq/design';


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
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles.totalAmount}>
                <div className={styles.moneyTitle}>可提现金额</div>
                <div className={styles.moneyNum}>{this.props.walletData?.availableAmount}</div>
            </div>
            <div className={styles.moneyInput}>
              <MoneyInput getmoneyNum={data => this.getmoneyNum(data)} visible={this.state.visible} />
            </div>
          </div>
            <div className={styles.footer}>
              <Button type={'primary'} className={styles.button} onClick={() => this.moneyToWeixin()}>提现到微信钱包</Button>
            </div>
        </div>
    );
  }
}

export default withRouter(Withdrawal);
