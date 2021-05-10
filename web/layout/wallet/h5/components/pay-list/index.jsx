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
    this.payStatus = true ;

    this.showText = [
      '注册支出',
      '人工支出',
      '打赏了主题', // 打赏支出
      '付费查看了主题', // 付费支出
      '红包支出',
      '悬赏支出',
    ];
  }

  render() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.text}>{this.showText[this.props.payVal.type]}</div>
                <div className={styles.money}>-{this.props.payVal.money}</div>
            </div>
            <div className={styles.footer}>
              <div className={styles.time}>{diffDate(this.props.payVal.time)}</div>
              <div className={`${this.props.payVal.payStatus ? styles.payStatusTrue : styles.payStatusFalse}`}>{this.props.payVal.payStatus ? '已付款' : '待付款'}</div>
            </div>
        </div>
    );
  }
}

export default withRouter(IncomeList);
