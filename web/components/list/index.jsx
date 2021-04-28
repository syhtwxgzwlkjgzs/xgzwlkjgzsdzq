import React, { useEffect, useRef, useState } from 'react';
import { Spin } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} height 容器高度
 * @prop {function} className 容器样式
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise
 * @prop {function} allowRefresh 是否启用上拉刷新
 */

const List = ({ height, className = '', children, noMore = false, onRefresh, allowRefresh = true }) => {
  const listWrapper = useRef(null);
  const isLoading = useRef(false);
  const [loadText, setLoadText] = useState('加载中...');

  useEffect(() => {
    if (noMore) {
      setLoadText('没有更多数据');
      isLoading.current = true;
    }
  }, [noMore]);

  useEffect(() => {
    onTouchMove();
  }, []);

  const throttle = (fn, delay) => {
    let timer = null;

    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const onTouchMove = throttle(() => {
    if (!listWrapper || !listWrapper.current || !allowRefresh) {
      return;
    }
    const { clientHeight } = listWrapper.current;
    const { scrollHeight } = listWrapper.current;
    const { scrollTop } = listWrapper.current;

    if ((scrollHeight - 40 <= clientHeight + scrollTop) && !isLoading.current) {
      isLoading.current = true;
      setLoadText('加载中...');
      if (typeof(onRefresh) === 'function') {
        onRefresh()
          .then(() => {
            setLoadText('加载中...');
            isLoading.current = false;
          })
          .catch(() => {
            setLoadText('加载失败');
            isLoading.current = false;
          })
          .finally(() => {
            if (noMore) {
              setLoadText('没有更多数据');
              isLoading.current = true;
            }
          });
      }
    }
  }, 50);

  return (
    <div className={`${styles.container} ${className}`} style={{ height }}>
      <div
        className={styles.wrapper}
        ref={listWrapper}
        onScroll={onTouchMove}
      >
        {children}
        {allowRefresh && (
              <div className={styles.footer}>
                { loadText === '加载中...' && <Spin className={styles.spin} type="spinner" /> }
                { loadText }
              </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(List);
