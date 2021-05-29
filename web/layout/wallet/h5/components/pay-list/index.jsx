import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Avatar from '@components/avatar';
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
    const { itemKey, dataLength } = this.props
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.text}>{this.props.payVal.title || this.props.payVal.changeDesc}</div>
          <div className={styles.money}>{this.props.payVal.amount}</div>
        </div>
        {/* // FIXME:这里的结构有问题 怪怪的 所以只能用数组长度取消底部边框线 */}
        <div className={styles.footer} style={{borderBottom: itemKey === dataLength - 1 && 0}}>
          <div className={styles.time}>{diffDate(time.formatDate(this.props.payVal.createdAt, 'YYYY-MM-DD'))}</div>
          <div className={`${this.props.payVal.status ? styles.payStatusTrue : styles.payStatusFalse}`}>
            {PAY_STATUS_MAP[this.props.payVal.status]}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(IncomeList);
