import React, { useMemo } from 'react';
import SectionTitle from '@components/section-title';
import BottomView from '@components/list/BottomView';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

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
    className = '',
    platform = 'pc',
    isNeedBottom = true,
    errorText = '',
    isError = false
  } = props;

  const isNoData = useMemo(() => !children || !!noData, [noData, children]);

  const pcStyle = useMemo(() => {
    if (platform === 'pc') {
      const width = type === 'small' ? styles.small : styles.normal;
      return `${styles.containerPC} ${width}`;
    }
    return styles.containerH5;
  }, [platform, type]);

  return (
    <View className={`${styles.container} ${pcStyle} ${className} ${isNeedBottom && styles.bottom}`}>
      {header || <SectionTitle {...props} />}
      {(!isLoading && !isNoData) ? children : <BottomView isError={isError} errorText={errorText} noMore={!isLoading && isNoData} loadingText='正在加载' />}
      {footer}
    </View>
  );
};

export default React.memo(Index);
