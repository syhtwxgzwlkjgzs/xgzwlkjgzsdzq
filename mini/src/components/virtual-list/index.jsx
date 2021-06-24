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
  showLoadingInCenter = false
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

  useEffect(() => {
    // const arr = arrTrans(5, data)
    // const length = arr.length
    // if (arr.length) {
    //   const newArr = dataSource.slice()
    //   newArr.push(arr[length - 1]) 
    //   setDataSource(newArr)
    // }

    const index = wholePageIndex.current
    if (data?.length) {
      const arr = dataSource.slice()
      const newData = data.slice(index * 10)
      arr.push(...newData)

      setDataSource(arr)
    }

    originalDataSource.current = data
    
  }, [data?.length])

  useEffect(() => {
    handleHeight()
  }, [dataSource])

  // useEffect(() => {
  //   observePage(wholePageIndex.current)
  // }, [heights])

  useEffect(() => {
    getWindowHeight().then((res) => {
      windowHeight.current = res
    })
  }, [])

  // const observePage = (pageIndex) => {
  //   const observerObj = Taro.createIntersectionObserver(this).relativeToViewport({ top: 2 * windowHeight.current, bottom: 2 * windowHeight.current });
  //   observerObj.observe(`#virtual-list-${pageIndex}`, (res) => {
  //     const newArr = dataSource.slice()
  //     console.log(pageIndex);
  //     if(res.intersectionRatio <= 0) {
  //       newArr[pageIndex] = { height: heights.current[pageIndex] }
  //     } else {
  //       newArr[pageIndex] = originalDataSource.current[pageIndex]
  //     }
  //     console.log(newArr);
  //     setDataSource(newArr)
  //   });
  // }

  // 获取元素高度
  const handleHeight = async () => {
    const index = wholePageIndex.current
    const newData = dataSource.slice(index * 10)

    const results = await Promise.all(newData.map(async (item, index) => {
      // 等待异步操作完成，返回执行结果
      const { height = 300 } = await getElementRect(`virtual-list-${index}`)

      return height
    }));
    
    heights.current.push(...results)
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

    const { scrollTop = 0 } = e?.detail || {}
    handleCurrentIndex(scrollTop)
  }

  const handleScrollToUpper = (e) => {
    onScrollToUpper(e);
  }

  const handleCurrentIndex = (realScrollTop) => {
    
    let computedCurrentIndex = 0
    // 滚动的时候需要实时去计算当然应该在哪一屏幕
    let tempScrollTop = 0;
    for(let i = 0; i < heights.current.length; i++) {
      tempScrollTop = tempScrollTop + heights.current[i];
      if(tempScrollTop > realScrollTop) {
       
        computedCurrentIndex = i;
        break;
      } 
    }
    
    const currentIndex = currentRenderIndex.current
    if (currentRenderIndex !== currentIndex) {

      const newDataSource = dataSource.map((item, index, arr) => {
        if(computedCurrentIndex-3 <= index && index <= computedCurrentIndex+10) {
          return { ...originalDataSource.current[index], isPlaceholder: true };
        } else {
          return { ...originalDataSource.current[index], isPlaceholder: false }
        }
      })
      currentRenderIndex.current = computedCurrentIndex
      setDataSource(newDataSource)
    }
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
          <View id={`virtual-list-${index}`} key={index}>
              {
                <Thread data={item} />
              }
          </View>
        ))
      }
      {onRefresh && showRefresh && <BottomView isError={isError} errorText={errText} noMore={noMore} handleError={handleError} />}
    </ScrollView>
  );
});
export default React.memo(VirtualList);
