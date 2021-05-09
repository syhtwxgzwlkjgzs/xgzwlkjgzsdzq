import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
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

  const isNoData = useMemo(() => {
    return !!children && noData
  }, [noData, children])

  return (
    <div className={`${styles.container} ${type === 'small' ? styles.small : styles.normal}`}>
      {header || <SectionTitle {...props} />}
      {!isLoading && !isNoData && children}
      {!isLoading && isNoData && <NoData />}
      {isLoading && !isNoData && <Spin type="spinner" />}
      {footer}
    </div>
  );
};

export default React.memo(Index);
