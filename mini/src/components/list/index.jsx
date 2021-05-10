import React, { useEffect, useRef, useState } from 'react';
import { Spin } from '@discuzq/design';
import { View, Text, ScrollView } from '@tarojs/components';
import { noop, isPromise } from '@components/thread/utils'
import styles from './index.module.scss';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} height 容器高度
 * @prop {function} className 容器样式
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise
 * @prop {function} allowRefresh 是否启用上拉刷新
 */

const List = ({ height, className = '', children, noMore = false, onRefresh, allowRefresh = true, onScroll = noop }) => {
  const listWrapper = useRef(null);
  const isLoading = useRef(false);
  const [loadText, setLoadText] = useState('加载更多...');

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
    return args => {
        if (fn.id) return

        fn.id = setTimeout(() => {
            fn.call(this, args)
            clearTimeout(fn.id)
            fn.id = null
        }, delay)
    }
  }

  const onTouchMove = (e) => {
    if (e && !isLoading.current) {
      isLoading.current = true;
      setLoadText('加载更多...');
      if (typeof(onRefresh) === 'function') {
        const promise = onRefresh()
        isPromise(promise) && promise
          .then(() => {
            setLoadText('加载更多...');
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
      } else {
        console.error('上拉刷新，必须返回promise');
      }
    }
  };

  const handleScroll = throttle(onScroll, 0)
 
  return (
    <ScrollView 
      scrollY 
      className={`${styles.container} ${className}`} 
      style={{ height }} 
      onScrollToLower={onTouchMove}
      lowerThreshold={80}
      onScroll={handleScroll}
    >
      {children}
      {allowRefresh && (
            <View className={styles.footer}>
              { loadText === '加载更多...' && <Spin className={styles.spin} type="spinner" /> }
              { loadText }
            </View>
      )}
    </ScrollView>
  );
};

export default React.memo(List);
