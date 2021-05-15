import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { noop, isPromise } from '@components/thread/utils';
import styles from './index.module.scss';
import RefreshView from './RefreshView';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} height 容器高度
 * @prop {function} className 容器样式
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise；若没有声明onRefresh，不触发上拉刷新
 * @prop {function} onScroll 滑动事件
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
}, ref) => {
  const listWrapper = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (noMore) {
      setIsLoading(true);
    }
  }, [noMore]);

  useEffect(() => {
    onTouchMove();
    // TODO 判断是处于PC端，且
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onBackTop,
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
  };

  const onTouchMove = throttle(() => {

    if (!listWrapper || !listWrapper.current || !onRefresh) {
      return;
    }
    const { clientHeight } = listWrapper.current;
    const { scrollHeight } = listWrapper.current;
    const { scrollTop } = listWrapper.current;

    // 滑动事件
    onScroll({ scrollTop });

    if ((scrollHeight - 40 <= clientHeight + scrollTop) && !isLoading) {
      setIsLoading(true);
      if (typeof(onRefresh) === 'function') {
        const promise = onRefresh();
        isPromise(promise) && promise
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
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
  }, 0);

  return (
    <div className={`${styles.container} ${className}`} style={{ height }}>
      <div
        className={`${styles.wrapper} ${wrapperClass}`}
        ref={listWrapper}
        onScroll={onTouchMove}
      >
        {children}
        {onRefresh && showRefresh && <RefreshView noMore={noMore} />}
      </div>
    </div>
  );
});

export default React.memo(List);
