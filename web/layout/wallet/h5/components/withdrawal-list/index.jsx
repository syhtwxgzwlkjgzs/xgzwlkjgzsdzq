import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Avatar from '@components/avatar';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';

import { Icon, Button } from '@discuzq/design';


@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.withdrawalStatus = 1; // 接通数据时将判断替换掉
  }

  render() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.text}>提现</div>
                <div className={styles.money}>{this.props.withdrawalVal.money}</div>
            </div>
            <div className={styles.footer}>
              <div className={styles.time}>{diffDate(this.props.withdrawalVal.time)}</div>
              {
                this.props.withdrawalVal.withdrawalStatus === 1 ? <div className={styles.withdrawalStatus1}>待审核</div> : ''
              }
              {
                this.props.withdrawalVal.withdrawalStatus === 2 ? <div className={styles.withdrawalStatus2}>已打款</div> : ''
              }
              {
                this.props.withdrawalVal.withdrawalStatus === 3 ? <div className={styles.withdrawalStatus3}>审核不通过</div> : ''
              }
              {
                this.props.withdrawalVal.withdrawalStatus === 4 ? <div className={styles.withdrawalStatus4}>打款中</div> : ''
              }
            </div>
            <div className={styles.serialNumber}>
              <span>流水号:</span><span>{this.props.withdrawalVal.serialNumber}</span>
            </div>
        </div>
    );
  }
}

export default withRouter(IncomeList);
