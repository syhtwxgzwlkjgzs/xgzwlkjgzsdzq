import React, { useMemo } from 'react';
import { Spin } from '@discuzq/design';
import SectionTitle from '@components/section-title';
import NoData from '@components/no-data';
import styles from './index.module.scss';

/**
 * PC端，右侧边栏面板组件（容器）
 * @prop {function} noData 是否出现无数据页面
 * @prop {function} isLoading 是否出现加载数据页面
 * @prop {function} isNeedBottom 是否需要底部间距
 * @prop {'wrapper' | 'plane'} mold 需不需要padding包裹children
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
    mold='wrapper'
  } = props;

  const isNoData = useMemo(() => !children || !!noData, [noData, children]);

  const pcStyle = useMemo(() => {
    if (platform === 'pc') {
      const width = type === 'small' ? styles.small : styles.normal;
      return `${styles.containerPC} ${width}`;
    }
    return styles.containerH5;
  }, [platform, type]);

  const wrapperContent = () => {
    return (
      <div className={`${styles.container} ${pcStyle} ${className} ${isNeedBottom && styles.bottom}`}>
        {header || <SectionTitle {...props} />}
        {
          isLoading ? (
            <div className={styles.spinner}>
              <Spin type="spinner" />
            </div>
          ) : (
            isNoData ? <NoData /> : children
          )
        }
        {footer}
      </div>
    )
  }

  const planeContent = () => {
    return (
      <div className={className}>
        <div className={`${pcStyle} ${styles.containerPlane}`}>
          {header || <SectionTitle {...props} />}
        </div>
        {
          isLoading ? (
            <div className={styles.spinner}>
              <Spin type="spinner" />
            </div>
          ) : (
            isNoData ? <NoData className={styles.container} /> : children
          )
        }
      </div>
    )
  }

  return (
    <>
      {
        mold === 'wrapper' ? wrapperContent() : planeContent()
      }
    </>
  );
};

export default React.memo(Index);
