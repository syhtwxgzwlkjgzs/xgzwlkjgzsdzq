import React, { useMemo } from 'react';
import Spin from '@discuzq/design/dist/components/spin/index';
import SectionTitle from '@components/section-title';
import NoData from '@components/no-data';
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
    isNeedBottom = true
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
      {
        isLoading ? (
          <View className={styles.spinner}>
            <Spin type="spinner" />
          </View>
        ) : (
          isNoData ? <NoData /> : children
        )
      }
      {footer}
    </View>
  );
};

export default React.memo(Index);
