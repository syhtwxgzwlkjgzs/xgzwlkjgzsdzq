import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { noop, isPromise } from '@components/thread/utils'
import styles from './index.module.scss';
import BottomView from './BottomView';
import Thread from '@components/thread';
import { getElementRect, arrTrans, getWindowHeight, randomStr } from './utils';
import Taro from '@tarojs/taro';
import { throttle } from '@common/utils/throttle-debounce.js';
import BottomNavBar from '@components/bottom-nav-bar'
import { useMemo } from 'react';
import List from './List';

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
  currentPage,
  curr,
  onClickTabBar,
  isClickTab
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errText, setErrText] = useState(errorText);
  const [scrollTop, setScrollTop] = useState(-1);
  const [dataSource, setDataSource] = useState([]);
  
  const wholePageIndex = useRef(0)
  const currentRenderIndex = useRef(0)
  const windowHeight = useRef(null)
  const originalDataSource = useRef([])
  const heights = useRef([])
  const childrenHeightId = useRef(`home-header-${randomStr()}`)
  const childrenHeight = useRef(262)

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
      if (!data?.length) {
        resetAllData()
      } else {
        const arr = arrTrans(10, data)
        const length = arr.length
        if (arr.length) {
          const newArr = dataSource.slice()
          newArr.push(arr[length - 1]) 
          setDataSource(newArr)    
        }
        originalDataSource.current = arr
      }
    
  }, [data?.length])

  // 缓存所有的分组高度
  useEffect(() => {
    if (dataSource?.length) {
      handleHeight()
    }
    getChildrenHeight()
  }, [dataSource])

  // 获取屏幕高度
  useEffect(() => {
    getWindowHeight().then((res) => {
      windowHeight.current = res
    })
    getChildrenHeight()
  }, [])

    //   当源数据为空时，重置组件数据
    const resetAllData = () => {
        setDataSource([])
        originalDataSource.current = []
        wholePageIndex.current = 0
        currentRenderIndex.current = 0
        heights.current = []
    }

    // 获取children的高度
    const getChildrenHeight = () => {
        getElementRect(childrenHeightId.current).then((res) => {
            childrenHeight.current = res.height || 262
        })
    }

  // 获取元素高度
  const handleHeight = async () => {
    // const index = wholePageIndex.current
    // const { height = 300 } = await getElementRect(`virtual-list-${index}`)
    // heights.current[index] = height

    // observePage(wholePageIndex.current)
  }

  // 处理数据
  const handleCurrentIndex = (realScrollTop) => {
    
    let computedCurrentIndex = 0
    // 滚动的时候需要实时去计算当然应该在哪一屏幕
    let tempScrollTop = 0;
    for(let i = 0; i < heights.current.length; i++) {
      tempScrollTop = tempScrollTop + heights.current[i];
      if(tempScrollTop > realScrollTop + windowHeight.current + childrenHeight.current) {
        computedCurrentIndex = i;
        break;
      } 
    }
    const currentIndex = currentRenderIndex.current
    if (computedCurrentIndex !== currentIndex) {
      // if (computedCurrentIndex === 0) {
      //   debugger
      // }

      const newDataSource = dataSource.map((item, index, arr) => {
        if(computedCurrentIndex-1 <= index && index <= computedCurrentIndex+1) {
          return originalDataSource.current[index];
        } else {
          return { height: heights.current[index] }
        }
      })
      currentRenderIndex.current = computedCurrentIndex
      // console.log('currentRenderIndex.current', currentRenderIndex.current);

      setDataSource(newDataSource)
    }
  }

  const jumpToScrollTop = (scrollTop = 0) => {
    setScrollTop(scrollTop);
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
    // handleCurrentIndex(scrollTop)
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
    //   onTouchMove();
    }, 0)
  }

  const dispatch = (listData) => {
    setDataSource(listData)
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
        <View id={childrenHeightId.current}>
            {children}
        </View>

        <View style={{display: isClickTab ? 'none' : 'block'}}>
          <List 
            dataSource={dataSource} 
            wholePageIndex={wholePageIndex.current} 
            windowHeight={windowHeight.current} 
            dispatch={dispatch}
          />
        </View>   
        
        {onRefresh && showRefresh && <BottomView isError={isError} errorText={errText} noMore={noMore} handleError={handleError} />}

        <BottomNavBar onClick={onClickTabBar} placeholder curr={curr} />
    </ScrollView>
  );
});
export default React.memo(VirtualList);
