import React from 'react';
import { observer } from 'mobx-react';
import time from '@discuzq/sdk/dist/time';
import { diffDate } from '@common/utils/diff-date';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

@observer
class IncomeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { itemKey, dataLength } = this.props;
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <View className={styles.text}>
            {this.props.incomeVal.type === 0 ? <Text className={styles.name}>打赏用户名</Text> : ''}
            <Text>{this.props.incomeVal.title || this.props.incomeVal.changeDesc}</Text>
          </View>
          <View className={styles.money}>+{this.props.incomeVal.amount}</View>
        </View>
        {/* // FIXME:这里的结构有问题 怪怪的 所以只能用数组长度取消底部边框线 */}
        <View className={styles.time} style={{ borderBottom: itemKey === dataLength - 1 && 0 }}>
          {time.formatDate(this.props.incomeVal.createdAt, 'YYYY-MM-DD HH:mm')}
        </View>
      </View>
    );
  }
}

export default IncomeList;
