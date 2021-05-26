import styles from './index.module.scss';
import React from 'react';
import { View, Text } from '@tarojs/components';
import { Spin, Icon } from '@discuzq/design';
import classNames from 'classnames';

// 加载提示
export default function LoadingTips(props) {
  const { type, isError } = props;

  let elem =
    type === 'init' ? (
      <Spin className={styles.init} type="spinner" vertical>
        加载数据中...
      </Spin>
    ) : (
      <Spin className={styles.loadMore} type="spinner">
        加载更多...
      </Spin>
    );

  if (isError) {
    elem = (
      <View className={styles.error}>
        <Icon name="TipsOutlined"></Icon>
        <Text className={styles.text}>数据加载失败，请稍后再试</Text>
      </View>
    );
  }
  return <View className={classNames(styles.container, type === 'init' && styles.initContainer)}>{elem}</View>;
}
