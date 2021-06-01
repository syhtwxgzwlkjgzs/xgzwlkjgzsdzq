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
    return (
        <div className={styles.container}>
          我的天
        </div>
    );
  }
}

export default withRouter(WalletInfo);
