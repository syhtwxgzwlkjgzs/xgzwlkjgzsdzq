import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';
import status from './status.module.scss';


// 明细显示
const Detailed = (props) => {
  const { type, value } = props;
  const incomeText = [
    '打赏了你的主题',
    '人工收入',
    '主题红包收入',
    '红包退回',
    '悬赏问答答题收入',
    '悬赏贴过期返还剩余悬赏金额',
    '付费收入',
  ];
  const payText = [
    '注册支出',
    '人工支出',
    '打赏了主题',
    '付费查看了主题',
    '红包支出',
    '悬赏支出',
  ];
  return (
  <div>
    {
      type === 'income'
        ? <span>{`${value.type === 0 ? '打赏人名称' : ''}`} {incomeText[value.type]}</span> : ''
    }
    {
      type === 'pay'
        ? <span>{payText[value.type]}</span> : ''
    }
    {
      type === 'withdrawal'
        ? <span>{value.serialNumber}</span> : ''
    }
  </div>);
};
// 类型显示
const Type = (props) => {
  const { type, value } = props;
  const incomeType = [
    '打赏收入',
    '人工收入',
    '红包收入',
    '红包退回',
    '悬赏收入',
    '悬赏退回',
    '付费收入',
  ];
  const payType = [
    '注册支出',
    '人工支出',
    '打上支出',
    '付费支出',
    '红包支出',
    '悬赏支出',
  ];
  return (
  <div>
    {
      type === 'income'
        ? <span>{incomeType[value.type]}</span> : ''
    }
    {
      type === 'pay'
        ? <span>{payType[value.type]}</span> : ''
    }
  </div>);
};
// 状态显示
const Status = (props) => {
  const { type, value } = props;
  return (
  <div>
    {
      type === 'pay'
        ? <span className={`${value.payStatus ? status.payTrue : status.payFalse}`}>
            {value.payStatus ? '已付款' : '待付款'}
        </span> : ''
    }
    {
      type === 'withdrawal'
        ? <span>
          {
            value.withdrawalStatus === 0 ? <sapn className={status.withdrawalStatus0}>待审核</sapn> : ''
          }
          {
            value.withdrawalStatus === 1 ? <sapn className={status.withdrawalStatus1}>已打款</sapn> : ''
          }
          {
            value.withdrawalStatus === 2 ? <sapn className={status.withdrawalStatus2}>审核不通过</sapn> : ''
          }
          {
            value.withdrawalStatus === 3 ? <sapn className={status.withdrawalStatus3}>打款中</sapn> : ''
          }
        </span> : ''
    }
  </div>);
};
// 金额显示
const Money = (props) => {
  const { type, value } = props;

  return (
  <div>
    <span className={`${type === 'income' ? status.moneyTrue : status.moneyFalse}`}>
      {`${type === 'income' ? '+' : '-'}`}{value.money}
    </span>
  </div>);
};

@observer
class WalletInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const recordType = {
      income: {
        detailed: '收入明细',
        type: '收入类型',
        money: '收入金额',
        time: '收入时间',
      },
      pay: {
        detailed: '支出明细',
        type: '支出类型',
        status: '支出状态',
        money: '支出金额',
        time: '支出时间',
      },
      withdrawal: {
        serialNumber: '流水号',
        status: '支出状态',
        money: '支出金额',
        time: '支出时间',
      },
    };
    return (
        <div className={styles.container}>
          <div className={styles.title}>
            <div className={`${this.props.type === 'pay' ? styles.leftWidth : ''} ${styles.left}`}>
              {recordType[this.props.type].detailed || recordType[this.props.type].serialNumber}
            </div>
            <div className={`${this.props.type === 'pay' ? styles.rigthWidth : ''} ${styles.rigth}`}>
              {
                recordType[this.props.type].type
                  ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.type}`}>
                      {recordType[this.props.type].type}
                    </div> : ''
              }
              {
                recordType[this.props.type].status
                  ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.status}`}>
                      {recordType[this.props.type].status}
                    </div> : ''
              }
              {
                recordType[this.props.type].money
                  ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.money}`}>
                      {recordType[this.props.type].money}
                    </div> : ''
              }
              {
                recordType[this.props.type].time
                  ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.time}`}>
                       {recordType[this.props.type].time}
                    </div> : ''
              }
            </div>
          </div>
          {
            this.props?.data?.map(value => (
          <div className={styles.content} key={value.id}>
            <div className={`${this.props.type === 'pay' ? styles.leftWidth : ''} ${styles.left}`}>
              {/* 支出、收入明细、流水号 */}
              <Detailed
                type={this.props.type}
                value={value}
              ></Detailed>
            </div>
            <div className={`${this.props.type === 'pay' ? styles.rigthWidth : ''} ${styles.rigth}`}>
            {
              recordType[this.props.type].type
                ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.type}`}>
                  <Type
                    type={this.props.type}
                    value={value}
                  ></Type>
                </div> : ''
            }
            {
              recordType[this.props.type].status
                ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.status}`}>
                  <Status
                    type={this.props.type}
                    value={value}
                  ></Status>
                </div> : ''
            }
            {
              recordType[this.props.type].money
                ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.money}`}>
                  <Money
                    type={this.props.type}
                    value={value}
                  ></Money>
                </div> : ''
            }
            {
              recordType[this.props.type].time
                ? <div className={`${this.props.type === 'pay' ? styles.payWidth : ''} ${styles.time}`}>
                  {diffDate(value.time)}
                </div> : ''
            }
            </div>
          </div>))
          }
        </div>
    );
  }
}

export default withRouter(WalletInfo);
