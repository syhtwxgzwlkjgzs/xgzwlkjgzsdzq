import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { noop, isPromise } from '@components/thread/utils';
import styles from './index.module.scss';
import RefreshView from './RefreshView';
import ErrorView from './ErrorView';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} className 容器样式，用于确定list高度；必传
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise；若没有声明onRefresh，不触发上拉刷新。
 * @prop {function} onScroll 滑动事件
 * @prop {function} wrapperClass 内部元素className
 * @prop {function} showRefresh 是否展示loading视图
 * @prop {function} onError 当onRefresh返回reject时，触发回调
 * @prop {function} enableError 是否启用reject捕获
 * @prop {function} immediateCheck 初始化的时候，是否立即请求一次
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
  preload = 30,
  onError = noop,
  enableError = false,
  immediateCheck = true,
}, ref) => {
  const listWrapper = useRef(null);
  const currentScrollTop = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (noMore) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [noMore]);

  useEffect(() => {
    // 初始化的时候，是否立即请求一次
    if (immediateCheck) {
      onTouchMove({ isFirst: true });
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onBackTop,
      jumpToScrollTop,
      currentScrollTop,
      isLoading,
    }),
  );

  const throttle = (fn, delay) => {
    let timer = null;

    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const onBackTop = () => {
    listWrapper.current.scrollTop = 0;
    currentScrollTop.current = 0;
  };

  const jumpToScrollTop = (scrollTop) => {
    if (scrollTop && scrollTop > 0) {
      listWrapper.current.scrollTop = scrollTop;
    }
  };

  const onTouchMove = throttle(({ isFirst = false }) => {
    if (!listWrapper || !listWrapper.current) {
      onScroll();
      return;
    }

    const { clientHeight } = listWrapper.current;
    const { scrollHeight } = listWrapper.current;
    const { scrollTop } = listWrapper.current;

    // 滑动事件
    onScroll({ scrollTop });
    currentScrollTop.current = scrollTop;

    if (!onRefresh) return;

    // 处理首页筛选，更新数据的时候，会触发一次上拉刷新
    let allowHandleRefresh = true;
    if (!isFirst) {
      allowHandleRefresh = (scrollTop !== 0);
    }
    if ((scrollHeight - preload <= clientHeight + scrollTop) && !isLoading && allowHandleRefresh) {
      setIsLoading(true);
      if (typeof(onRefresh) === 'function') {
        const promise = onRefresh();
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
            setIsLoading(true);
            setIsError(true);
            onError();
          });
      } else {
        console.error('上拉刷新，必须返回promise');
      }
    }
  }, 0);

  // 网络请求失败
  const handleError = () => {
    // setIsLoading(false);
    // setTimeout(() => {
    //   onTouchMove();
    // }, 0)
  };

  return (
    <div className={`${styles.container} ${className}`} style={{ height }}>
      <div
        className={`${styles.wrapper} ${wrapperClass}`}
        ref={listWrapper}
        onScroll={onTouchMove}
      >
        {children}
        {onRefresh && showRefresh && !isError && <RefreshView noMore={noMore} />}
        {showRefresh && isError && <ErrorView onClick={handleError} />}
      </div>
    </div>
  );
});

export default React.memo(List);
