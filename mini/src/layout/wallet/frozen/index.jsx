import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { View, Text } from '@tarojs/components';

import styles from './index.module.scss';

@observer
class FrozenAmount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.frozenType = [
      '问答冻结',
      '长文贴红包冻结',
      '文字红包贴冻结',
    ];
  }

  render() {
    // 伪造的数据
    const frozenData = [
      {
        id: 1,
        type: 1,
        time: '2021-3-25 14:50',
        ID: 123456789,
      },
      {
        id: 2,
        type: 2,
        time: '2021-3-25 14:50',
        ID: 123456789,
      },
      {
        id: 3,
        type: 3,
        time: '2021-3-25 14:50',
        ID: 123456789,
      },
    ];

    return (
        <View className={styles.container}>
          <View className={styles.header}>
            <View className={styles.record}>共有{3}条记录</View>
            <View className={styles.totalMoney}>涉及金额 {15.00}元</View>
          </View>
          <View className={styles.body}>
          {
            frozenData.map(value => (
              <View className={styles.content} key={value.id}>
                <View className={styles.upper}>
                  <View>问答冻结</View>
                  <View>1.00</View>
                </View>
                <View className={styles.lower}>
                  <View>2021-3-25 14:50</View>
                  <View>ID: <Text>180617</Text></View>
                </View>
              </View>
            ))}
          </View>
        </View>
    );
  }
}

export default withRouter(FrozenAmount);
