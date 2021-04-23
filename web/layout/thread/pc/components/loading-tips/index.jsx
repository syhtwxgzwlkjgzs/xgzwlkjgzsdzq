import styles from './index.module.scss';
import React from 'react';
import { Spin } from '@discuzq/design';
import classNames from 'classnames';

// 加载提示
export default function LoadingTips(props) {
  const { type } = props;
  return <div className={classNames(styles.container, type === 'init' && styles.init)}>
        {type === 'init'
          ? <Spin type="spinner" color="#8590A6" size='80px' vertical>初始化页面...</Spin>
          : <Spin type="spinner" color="#8590A6">加载中 ...</Spin>
        }
    </div>;
}
