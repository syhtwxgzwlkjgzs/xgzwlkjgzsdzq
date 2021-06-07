import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { diffDate } from '@common/utils/diff-date';
import styles from './index.module.scss';
import status from './status.module.scss';
import RenderList from '../../../../../components/renderList';
import {
  CASH_DETAIL_CONSTANTS,
  INCOME_DETAIL_CONSTANTS,
  PAY_STATUS_MAP,
} from '../../../../../../common/constants/wallet';
import { formatDate } from '@common/utils/format-date.js';
import time from '@discuzq/sdk/dist/time';
import classNames from 'classnames';

const STATUS_MAP = {
  1: '待审核',
  2: '审核通过',
  3: '审核不通过',
  4: '待打款',
  5: '已打款',
  6: '打款失败',
};

@observer
class WalletInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 获取收入明细列
  getIncomeColumns = () => {
    const columns = [
      {
        title: '收入明细',
        key: 'detail',
        render: item => (
          <span title={item.title} className={styles.normalText}>
            {item.title || '暂无内容'}
          </span>
        ),
      },
      {
        title: '收入类型',
        key: 'type',
        render: item => (
          <span title={item.changeDesc} className={styles.normalText}>
            {item.changeDesc || '暂无内容'}
          </span>
        ),
      },
      {
        title: '收入金额',
        key: 'amount',
        render: item => (
          <span title={`+${item.amount}` || 0.0} className={`${styles.incomeAmount}`}>
            {`+${item.amount}` || 0.0}
          </span>
        ),
      },
      {
        title: '收入时间',
        key: 'time',
        render: item => (
          <span title={time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')} className={`${styles.timer}`}>
            {time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')}
          </span>
        ),
      },
    ];
    return columns;
  };

  // 获取支出明细列
  getPayColumns = () => {
    const columns = [
      {
        title: '支出明细',
        key: 'detail',
        render: item => (
          <span title={item.title || '暂无内容'} className={styles.normalText}>
            {item.title || '暂无内容'}
          </span>
        ),
      },
      {
        title: '支出类型',
        key: 'type',
        render: item => (
          <span title={item.changeDesc} className={styles.normalText}>
            {item.changeDesc || '暂无内容'}
          </span>
        ),
      },
      {
        title: '支出状态',
        key: 'status',
        render: (item) => {
          for (const key in PAY_STATUS_MAP) {
            if (Number(key) === item.status) {
              return (
                <span
                  className={classNames(styles.payStatus, {
                    [styles.wait]: item.status === 0,
                    [styles.remited]: item.status === 1,
                  })}
                >
                  {PAY_STATUS_MAP[key] || '暂无内容'}
                </span>
              );
            }
          }
        },
      },
      {
        title: '支出金额',
        key: 'amount',
        render: item => <span className={styles.payAmount}>{item.amount || 0.0}</span>,
      },
      {
        title: '支出时间',
        key: 'time',
        render: item => (
          <span className={`${styles.timer}`}>{time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')}</span>
        ),
      },
    ];
    return columns;
  };

  // 获取冻结金额列
  getFrozenColumns = () => {
    const columns = [
      {
        title: 'ID',
        key: 'ID',
        render: item => <span className={styles.normalText}>{item.id || '暂无内容'}</span>,
      },
      {
        title: '记录描述',
        key: 'type',
        render: item => <span className={styles.normalText}>{item.changeDesc || '暂无内容'}</span>,
      },
      {
        title: '冻结金额',
        key: 'amount',
        render: item => <span className={`${styles.frozenAmount}`}>{item.amount || 0.0}</span>,
      },
      {
        title: '时间',
        key: 'time',
        render: item => (
          <span className={`${styles.timer}`}>{time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')}</span>
        ),
      },
    ];
    return columns;
  };

  // 获取冻结金额列
  getWithdrawalColumns = () => {
    const columns = [
      {
        title: '交易号',
        key: 'type',
        render: item => <span className={styles.normalText}>{item.tradeNo || '暂无内容'}</span>,
      },
      {
        title: '提现状态',
        key: 'status',
        render: item => <span className={
          classNames(styles.normalText,{
            [styles.wait]: item.cashStatus === 1,
            [styles.remitedFailed]: item.cashStatus === 3 || item.cashStatus === 6,
            [styles.pass]: item.cashStatus === 4,
            [styles.remited]: item.cashStatus === 5
          })
        }>{STATUS_MAP[item.cashStatus] || '暂无内容'}</span>,
      },
      {
        title: '提现金额',
        key: 'cashApplyAmount',
        render: item => <span className={`${styles.frozenAmount}`}>-{item.cashApplyAmount}</span>,
      },
      {
        title: '提现时间',
        key: 'time',
        render: item => (
          <span className={`${styles.timer}`}>{item.tradeTime ? time.formatDate(item.tradeTime, 'YYYY-MM-DD HH:mm') : '暂无'}</span>
        ),
      },
    ];
    return columns;
  };

  renderColumns = () => {
    const { activeType } = this.props;
    let columns = [];
    switch (activeType) {
      case 'income':
        columns = this.getIncomeColumns();
        break;
      case 'pay':
        columns = this.getPayColumns();
        break;
      case 'withdrawal':
        columns = this.getWithdrawalColumns();
        break;
      case 'frozen':
        columns = this.getFrozenColumns();
        break;
      default:
        break;
    }
    return columns;
  };

  render() {
    const { data = [] } = this.props;
    return (
      <div className={styles.container}>
        <RenderList columns={this.renderColumns()} data={data} className={styles.tabelList} />
      </div>
    );
  }
}

export default withRouter(WalletInfo);
