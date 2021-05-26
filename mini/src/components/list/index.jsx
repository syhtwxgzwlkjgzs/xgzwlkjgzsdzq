import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView } from '@tarojs/components';
import { noop, isPromise } from '@components/thread/utils'
import styles from './index.module.scss';
import RefreshView from './RefreshView';
import ErrorView from './ErrorView';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} height 容器高度
 * @prop {function} className 容器样式
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise
 * @prop {function} showRefresh 是否启用上拉刷新
 */
const List = forwardRef(({
  height,
  className = '',
  wrapperClass = '',
  children,
  noMore,
  onRefresh,
  onScroll = noop,
  showRefresh = true,
  preload = 30
}, ref) => {
  const listWrapper = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (noMore) {
      setIsLoading(true);
    }
  }, [noMore]);

  // useEffect(() => {
  //   onTouchMove();
  // }, []);

  useImperativeHandle(
    ref,
    () => ({
      onBackTop,
      isLoading,
    }),
  );

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

  const onBackTop = () => {
    if(!listWrapper) {
      listWrapper.current.scrollTop = 0;
    }
  };

  const onTouchMove = (e) => {
    if (e && !isLoading.current && onRefresh && !isLoading) {
      setIsLoading(true);
      if (typeof(onRefresh) === 'function') {
        const promise = onRefresh()
        isPromise(promise) && promise
          .then(() => {
            // 解决因promise和react渲染不同执行顺序导致重复触发加载数据的问题
            setTimeout(() => {
              setIsLoading(false);
              if (noMore) {
                setIsLoading(true);
              }
            }, 0);
          })
          .catch(() => {
            setIsLoading(false);
            setIsError(true);
          })
          .finally(() => {
            if (noMore) {
              setIsLoading(true);
            }
          });
      } else {
        console.error('上拉刷新，必须返回promise');
      }
    }
  };
  const handleScroll = throttle(onScroll, 0)

    // 网络请求失败
    const handleError = () => {
      setIsLoading(false);
      setTimeout(() => {
        onTouchMove();
      }, 0)
    }

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
      {onRefresh && showRefresh && !isError && <RefreshView noMore={noMore} />}
      {isError && <ErrorView onClick={handleError} />}
    </ScrollView>
  );
});
export default React.memo(List);
