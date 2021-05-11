import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { View, Text } from '@tarojs/components';
import { Icon, Button } from '@discuzq/design';

import Avatar from '@components/avatar';

import styles from './index.module.scss';



@observer
class WalletInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <View className={styles.container}>
            <View className={styles.totalAmount}>
                <View className={styles.moneyTitle}>当前总金额</View>
                {
                  this.props.walletData?.freezeAmount && this.props.walletData?.availableAmount
                    ? <View className={styles.moneyNum}>
                    {Number(this.props.walletData?.freezeAmount) + Number(this.props.walletData?.availableAmount)}
                  </View> : <View className={styles.moneyNum}></View>
                }
            </View>
            <View className={styles.amountStatus}>
                <View className={styles.frozenAmount} onClick={this.props.onFrozenAmountClick}>
                    <View className={styles.statusTitle}>
                        <Text>冻结金额</Text>
                    </View>
                    <View className={styles.statusNum}>{this.props.walletData?.freezeAmount}</View>
                </View>
                <View className={styles.withdrawalAmount}>
                    <View className={styles.statusTitle}>可提现金额</View>
                    <View className={styles.statusNum}>{this.props.walletData?.availableAmount}</View>
                </View>
            </View>
        </View>
    );
  }
}

export default withRouter(WalletInfo);
