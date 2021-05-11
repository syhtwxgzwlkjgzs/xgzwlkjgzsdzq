import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { View, Text } from '@tarojs/components';

import Avatar from '@components/avatar';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';



@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.isShowName = true; // 接通数据后将判断换掉
    this.showText = [
      '打赏了你的主题',
      '人工收入',
      '主题红包收入',
      '红包退回',
      '悬赏问答答题收入',
      '悬赏贴过期返还剩余悬赏金额',
      '付费收入',
    ];
  }

  render() {
    return (
        <View className={styles.container}>
            <View className={styles.content}>
                <View className={styles.text}>
                    {
                        this.props.incomeVal.type === 0
                          ? <Text className={styles.name}>打赏用户名 </Text> : ''
                    }
                    <Text>{this.showText[this.props.incomeVal.type]}</Text>
                </View>
                <View className={styles.money}>+{this.props.incomeVal.money}</View>
            </View>
            <View className={styles.time}>{diffDate(this.props.incomeVal.time)}</View>
        </View>
    );
  }
}

export default withRouter(IncomeList);
