import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Avatar from '@components/avatar';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';

import { Icon, Button } from '@discuzq/design';

const STATUS_MAP = {
  1: '待审核',
  2: '审核通过',
  3: '审核不通过',
  4: '待打款',
  5: '已打款',
  6: '打款失败',
}

@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { cashApplyAmount, tradeTime, cashStatus, tradeNo } = this.props.withdrawalVal
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.text}>提现</div>
          <div className={styles.money}>{cashApplyAmount}</div>
        </div>
        <div className={styles.footer}>
          <div className={styles.time}>
            {tradeTime ?diffDate(tradeTime) : ''}
          </div>
          <div className={styles[`withdrawalStatus${cashStatus}`]}>
            {STATUS_MAP[cashStatus]}
          </div>
        </div>
        <div className={styles.serialNumber}>
          <span>流水号:</span><span>{tradeNo || ''}</span>
        </div>
      </div>
    );
  }
}

export default withRouter(IncomeList);
