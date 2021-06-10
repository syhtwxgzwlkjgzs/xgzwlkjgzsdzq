import React from 'react';
import { observer } from 'mobx-react';
import { View } from '@tarojs/components';
import { diffDate } from '@common/utils/diff-date';
import { time } from '@discuzq/sdk/dist/index';

import styles from './index.module.scss';

const PAY_STATUS_MAP = {
  0: '待付款',
  1: '已付款',
  2: '取消订单',
  3: '支付失败',
  4: '订单已过期',
  5: '部分退款',
  10: '全额退款',
  11: '异常订单',
};

@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.payStatus = true;
  }

  render() {
    const { itemKey, dataLength } = this.props;
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <View className={styles.text}>{this.props.payVal.title || this.props.payVal.changeDesc}</View>
          <View className={styles.money}>{this.props.payVal.amount}</View>
        </View>
        {/* // FIXME:这里的结构有问题 怪怪的 所以只能用数组长度取消底部边框线 */}
        <View className={styles.footer} style={{ borderBottom: itemKey === dataLength - 1 && 0 }}>
          <View className={styles.time}>{time.formatDate(this.props.payVal.createdAt, 'YYYY-MM-DD HH:mm')}</View>
          <View className={`${this.props.payVal.status ? styles.payStatusTrue : styles.payStatusFalse}`}>
            {PAY_STATUS_MAP[this.props.payVal.status]}
          </View>
        </View>
      </View>
    );
  }
}

export default IncomeList;
