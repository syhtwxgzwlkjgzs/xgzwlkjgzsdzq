import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View } from '@tarojs/components';
import { getElementRect, arrTrans, getWindowHeight, randomStr } from './utils';
import List from './List';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} height 容器高度
 * @prop {function} className 容器样式
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise
 * @prop {function} showRefresh 是否启用上拉刷新
 */
const VirtualList = ({
  data,
  isClickTab,
  wholePageIndex
}) => {
  const [dataSource, setDataSource] = useState([]);
  const windowHeight = useRef(null)

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
      }
    
  }, [data?.length])

  // 获取屏幕高度
  useEffect(() => {
    getWindowHeight().then((res) => {
      windowHeight.current = res
    })
  }, [])

    //   当源数据为空时，重置组件数据
    const resetAllData = () => {
        setDataSource([])
    }

  const dispatch = (threadId, updatedThreadData) => {
    if(!threadId || !updatedThreadData) return;

    let newArr = [ ...dataSource ];
    newArr.forEach((subArr) => {
      for(let i = 0; i < subArr.length; i++) {
        if(subArr[i].threadId === threadId) {
          subArr[i] = updatedThreadData;
          break;
        }
      }
    });
    setDataSource(newArr);
  }

  return (
        <List 
        dataSource={dataSource} 
        wholePageIndex={wholePageIndex} 
        windowHeight={windowHeight.current} 
        dispatch={dispatch}
        />
  );
}
export default VirtualList;
