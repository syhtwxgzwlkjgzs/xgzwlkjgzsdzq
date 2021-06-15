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
  onScrollToUpper = noop,
  hasOnScrollToLower = false,
  showRefresh = true,
  preload = 30,
  requestError = false,
  errorText = '加载失败',
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errText, setErrText] = useState(errorText);
  const [scrollTop, setScrollTop] = useState(-1);

  useEffect(() => {
      setIsLoading(noMore);
  }, [noMore]);

  useEffect(() => {
    setIsError(requestError)
  }, [requestError])

  useEffect(() => {
    setErrText(errorText)
  }, [errorText])

  useImperativeHandle(
    ref,
    () => ({
      jumpToScrollTop,
    }),
  );


  const jumpToScrollTop = (scrollTop) => {
    if (scrollTop && scrollTop > 0) {
      setScrollTop(scrollTop);
    }
  };

  const onTouchMove = (e) => {
    if (e && onRefresh && !isLoading && !requestError) {
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
          .catch((err) => {
            setIsLoading(false);
            setIsError(true);
            setErrText(err || '加载失败')
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

  const handleScroll = (e) => {
    onScroll(e);
  }

  const handleScrollToUpper = (e) => {
    onScrollToUpper(e);
  }

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
      onScrollToLower={hasOnScrollToLower ? onTouchMove : null}
      lowerThreshold={80}
      onScroll={handleScroll}
      scrollTop={scrollTop}
      onScrollToUpper={handleScrollToUpper}
      upperThreshold={182}
    >
      {children}
      {onRefresh && showRefresh && !isError && <RefreshView noMore={noMore} />}
      {isError && <ErrorView text={errText} onClick={handleError} />}
    </ScrollView>
  );
});
export default React.memo(List);
