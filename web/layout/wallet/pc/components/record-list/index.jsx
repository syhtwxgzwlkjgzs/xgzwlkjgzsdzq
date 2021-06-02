import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { diffDate } from '@common/utils/diff-date';
import styles from './index.module.scss';
import status from './status.module.scss';
import RenderList from '../../../../../components/renderList';
import { CASH_DETAIL_CONSTANTS, INCOME_DETAIL_CONSTANTS, PAY_STATUS_MAP } from '../../../../../../common/constants/wallet';
import { formatDate } from '@common/utils/format-date.js';
import time from '@discuzq/sdk/dist/time';
import classNames from 'classnames';

@observer
class WalletInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 获取收入明细列
  getIncomeColumns = () => {
    const columns = [
      {
        title: "收入明细",
        key: "detail",
        render: (item) => {
          return <span className={styles.normalText}>{item.title || ""}</span>
        }
      },
      {
        title: "收入类型",
        key: "type",
        render: (item) => {
          return <span className={styles.normalText}>{item.changeDesc}</span>
        }
      },
      {
        title: "收入金额",
        key: "amount",
        render: (item) => {
          return <span className={`${styles.incomeAmount}`}>{"+" + item.amount || 0.00}</span>
        }
      },
      {
        title: "收入时间",
        key: 'time',
        render: (item) => {
          return <span className={`${styles.timer}`}>{time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')}</span>
        }
      }
    ]
    return columns
  }

  // 获取支出明细列
  getPayColumns = () => {
    const columns = [
      {
        title: "支出明细",
        key: "detail",
        render: (item) => {
          return <span className={styles.normalText}>{item.title || "暂无内容"}</span>
        }
      },
      {
        title: "支出类型",
        key: "type",
        render: (item) => {
          return <span className={styles.normalText}>{item.changeDesc}</span>
        }
      },
      {
        title: "支出状态",
        key: "status",
        render: (item) => {
          for (const key in PAY_STATUS_MAP) {
            if (Number(key) === item.status) {
              return <span className={
                classNames(styles.payStatus,{
                  [styles.wait]: item.status === 0,
                  [styles.remited]: item.status === 1,
                  // [styles.overrule]: item.status === 2,
                  // [styles.overrule]: item.status === 3,
                  // [styles.overrule]: item.status === 4,
                  // [styles.remitedFailed]: item.status === 5,
                  // [styles.remitedFailed]: item.status === 10,
                  // [styles.remitedFailed]: item.status === 11,
                })
              }>{PAY_STATUS_MAP[key] || ''}</span>;
            }
          }
        }
      },
      {
        title: "支出金额",
        key: "amount",
        render: (item) => {
          return <span className={styles.payAmount}>{item.amount || 0.00}</span>
        }
      },
      {
        title: "支出时间",
        key: 'time',
        render: (item) => {
          return <span className={`${styles.timer}`}>{time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')}</span>
        }
      }
    ]
    return columns
  }

  // 获取提现明细列
  getWithdrawalColumns = () => {
    const columns = [
      {
        title: "交易号",
        key: "detail",
        render: (item) => {
          return <span className={styles.normalText}>{item.tradeNo || "暂无"}</span>
        }
      },
      {
        title: "提现状态",
        key: "type",
        render: (item) => {
          for (const key in CASH_DETAIL_CONSTANTS) {
            if (CASH_DETAIL_CONSTANTS[key].code === item.cashStatus) {
              return <span className={
                classNames(styles.normalText,{
                  [styles.wait]: item.cashStatus === 1,
                  [styles.pass]: item.cashStatus === 2,
                  [styles.overrule]: item.cashStatus === 3,
                  [styles.remiting]: item.cashStatus === 4,
                  [styles.remited]: item.cashStatus === 5,
                  [styles.remitedFailed]: item.cashStatus === 6,
                })
              }>{CASH_DETAIL_CONSTANTS[key].text || ''}</span>;
            }
          }
        }
      },
      {
        title: "提现金额",
        key: "amount",
        render: (item) => {
          return <span className={`${styles.withdrawalAmount}`}>{"-" + item.cashApplyAmount || 0.00}</span>
        }
      },
      {
        title: "提现时间",
        key: 'time',
        render: (item) => {
          return <span className={`${styles.timer}`}>{item.tradeTime ? time.formatDate(item.tradeTime, 'YYYY-MM-DD HH:mm') : "暂无时间"}</span>
        }
      }
    ]
    return columns
  }

  // 获取冻结金额列
  getFrozenColumns = () => {
    const columns = [
      {
        title: "ID",
        key: "ID",
        render: (item) => {
          return <span className={styles.normalText}>{item.title || item.id || ""}</span>
        }
      },
      {
        title: "记录描述",
        key: "type",
        render: (item) => {
          return <span className={styles.normalText}>{item.changeDesc}</span>
        }
      },
      {
        title: "冻结金额",
        key: "amount",
        render: (item) => {
          return <span className={`${styles.frozenAmount}`}>{item.amount || 0.00}</span>
        }
      },
      {
        title: "时间",
        key: 'time',
        render: (item) => {
          return <span className={`${styles.timer}`}>{time.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm')}</span>
        }
      }
    ]
    return columns
  }

  renderColumns = () => {
    const { activeType } = this.props
    let columns = []
    switch (activeType) {
      case "income":
        columns = this.getIncomeColumns()
        break;
      case "pay":
        columns = this.getPayColumns()
        break;
      case "withdrawal":
        columns = this.getWithdrawalColumns()
        break;
      case "frozen":
        columns = this.getFrozenColumns()
        break;
      default:
        break;
    }
    return columns
  }

  render() {
    const { data = [] } = this.props
    return (
      <div className={styles.container}>
        <RenderList columns={this.renderColumns()} data={data} className={styles.tabelList} />
      </div>
    );
  }
}

export default withRouter(WalletInfo);
