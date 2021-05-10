import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { View, Text } from '@tarojs/components';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';



@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.withdrawalStatus = 1; // 接通数据时将判断替换掉
  }

  render() {
    return (
        <View className={styles.container}>
            <View className={styles.content}>
                <View className={styles.text}>提现</View>
                <View className={styles.money}>{this.props.withdrawalVal.money}</View>
            </View>
            <View className={styles.footer}>
              <View className={styles.time}>{diffDate(this.props.withdrawalVal.time)}</View>
              {
                this.props.withdrawalVal.withdrawalStatus === 1 ? <View className={styles.withdrawalStatus1}>待审核</View> : ''
              }
              {
                this.props.withdrawalVal.withdrawalStatus === 2 ? <View className={styles.withdrawalStatus2}>已打款</View> : ''
              }
              {
                this.props.withdrawalVal.withdrawalStatus === 3 ? <View className={styles.withdrawalStatus3}>审核不通过</View> : ''
              }
              {
                this.props.withdrawalVal.withdrawalStatus === 4 ? <View className={styles.withdrawalStatus4}>打款中</View> : ''
              }
            </View>
            <View className={styles.serialNumber}>
              <Text>流水号:</Text><Text>{this.props.withdrawalVal.serialNumber}</Text>
            </View>
        </View>
    );
  }
}

export default withRouter(IncomeList);
