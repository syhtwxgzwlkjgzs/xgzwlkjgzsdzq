import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Spin, Button } from '@discuzq/design';
import SectionTitle from '@components/section-title';
import NoData from '@components/no-data';
import styles from './index.module.scss';

/**
 * PC端，右侧边栏面板组件（容器）
 * @prop {function} noData 是否出现无数据页面
 * @prop {function} isLoading 是否出现加载数据页面
 */

const Index = (props) => {
  const { 
    noData = true, 
    isLoading = false, 
    children, 
    footer = null, 
    header = null, 
    type = 'small',
  } = props

  return (
    <div className={`${styles.container} ${type === 'small' ? styles.small : styles.normal}`}>
      {header || <SectionTitle {...props} />}
      {!isLoading && !noData && children}
      {!isLoading && noData && <NoData />}
      {isLoading && !noData && <Spin type="spinner" />}
      {footer}
    </div>
  );
};

export default React.memo(Index);
