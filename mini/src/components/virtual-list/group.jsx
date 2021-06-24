import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { noop, isPromise } from '@components/thread/utils'
import styles from './index.module.scss';
import BottomView from './BottomView';
import Thread from '@components/thread';
import { getElementRect, arrTrans, getWindowHeight } from './utils';
import Taro from '@tarojs/taro';
import { throttle } from '@common/utils/throttle-debounce.js';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} height 容器高度
 * @prop {function} className 容器样式
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise
 * @prop {function} showRefresh 是否启用上拉刷新
 */
const VirtualList = forwardRef(({
  data,
  className = '',
  wrapperClass = '',
  children,
  noMore,
  onRefresh,
  onScroll = noop,
  onScrollToUpper = noop,
  hasOnScrollToLower = false,
  showRefresh = true,
  preload = 1000,
  requestError = false,
  errorText = '加载失败',
  showLoadingInCenter = false,
  currentPage
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errText, setErrText] = useState(errorText);
  const [scrollTop, setScrollTop] = useState(-1);
  const [dataSource, setDataSource] = useState([]);
  
  const wholePageIndex = useRef(0)
  const currentRenderIndex = useRef(0)
  const windowHeight = useRef(667)
  const originalDataSource = useRef([])
  const heights = useRef([])

  const isLoadingRef = useRef(false);

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

  // 处理分组数据
  useEffect(() => {
    const arr = arrTrans(10, data)
    const length = arr.length
    if (arr.length) {
      const newArr = dataSource.slice()
      newArr.push(arr[length - 1]) 
      setDataSource(newArr)
    }
    originalDataSource.current = arr
  }, [data?.length])

  // 缓存所有的分组高度
  useEffect(() => {
    handleHeight()
  }, [dataSource])

  // 获取屏幕高度
  useEffect(() => {
    getWindowHeight().then((res) => {
      windowHeight.current = res
    })
  }, [])

  // 获取元素高度
  const handleHeight = async () => {
    const index = wholePageIndex.current
    const { height = 300 } = await getElementRect(`virtual-list-${index}`)
    
    heights.current[index] = height
  }

  // 处理数据
  const handleCurrentIndex = (realScrollTop) => {
    
    let computedCurrentIndex = 0
    // 滚动的时候需要实时去计算当然应该在哪一屏幕
    let tempScrollTop = 0;
    for(let i = 0; i < heights.current.length; i++) {
      tempScrollTop = tempScrollTop + heights.current[i];
      if(tempScrollTop > realScrollTop + windowHeight.current) {
       
        computedCurrentIndex = i;
        break;
      } 
    }
    
    const currentIndex = currentRenderIndex.current
    if (currentRenderIndex !== currentIndex) {

      const newDataSource = dataSource.map((item, index, arr) => {
        if(computedCurrentIndex-1 <= index && index <= computedCurrentIndex+1) {
          return originalDataSource.current[index];
        } else {
          return { height: heights.current[index] }
        }
      })
      currentRenderIndex.current = computedCurrentIndex
      setDataSource(newDataSource)
    }
  }

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
            wholePageIndex.current += 1
            // 解决因promise和react渲染不同执行顺序导致重复触发加载数据的问题
            setTimeout(() => {
              isLoadingRef.current = false;
              setIsLoading(false);
              if (noMore) {
                isLoadingRef.current = true;
                setIsLoading(true);
              }
            }, 0);
          })
          .catch((err) => {
            setIsLoading(false);
            isLoadingRef.current = false;
            setIsError(true);
            setErrText(err || '加载失败')
          })
          .finally(() => {
            if (noMore) {
              setIsLoading(true);
              isLoadingRef.current = true;
            }
          });
      } else {
        console.error('上拉刷新，必须返回promise');
      }
    }
  };

  const handleScroll = (e) => {
    onScroll(e);

    const { scrollTop = 0 } = e?.detail || {}
    handlePreFetch(e)
    handleCurrentIndex(scrollTop)
  }

  const handlePreFetch = async (e) => {
    const currentIndex = currentRenderIndex.current;
    if (wholePageIndex.current - currentIndex === 0 && !noMore && !isLoadingRef.current) {
      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        await onRefresh();
        wholePageIndex.current += 1
      } catch (e) {
        setIsError(true);
        setErrText(e || '加载失败');
      }
      setIsLoading(false);
      isLoadingRef.current = false;
    }
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
      className={`${styles.container} ${className} ${showLoadingInCenter ? styles.wrapperH5Center : ''}`}
      onScrollToLower={onTouchMove}
      onScroll={handleScroll}
      scrollTop={scrollTop}
      onScrollToUpper={handleScrollToUpper}
      upperThreshold={210}
    >
      {
        dataSource?.map((item, index) => (
          item?.length > 0 ? (
            <View id={`virtual-list-${index}`}>
              {
                item?.map((subItem, subIndex) => (<Thread data={subItem} key={subIndex} />))
              }
            </View>
          ) : (
            <View style={{ height: `${item ? item.height : 300}px` }}></View>
          )
        ))
      }
      {onRefresh && showRefresh && <BottomView isError={isError} errorText={errText} noMore={noMore} handleError={handleError} />}
    </ScrollView>
  );
});
export default React.memo(VirtualList);
