import React from 'react';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';



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
        <View className={styles.container}>
            <View className={styles.content}>
                <View className={styles.text}>{this.showText[this.props.payVal.type]}</View>
                <View className={styles.money}>-{this.props.payVal.money}</View>
            </View>
            <View className={styles.footer}>
              <View className={styles.time}>{diffDate(this.props.payVal.time)}</View>
              <View className={`${this.props.payVal.payStatus ? styles.payStatusTrue : styles.payStatusFalse}`}>{this.props.payVal.payStatus ? '已付款' : '待付款'}</View>
            </View>
        </View>
    );
  }
}

export default IncomeList;
