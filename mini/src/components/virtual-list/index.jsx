import React, { useEffect, useRef, useState } from 'react';
import { arrTrans, getWindowHeight } from './utils';
import List from './List';
import { inject, observer } from 'mobx-react';
import { useMemo } from 'react';

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
  wholePageIndex,
  index: indexStore
}) => {
  const [dataSource, setDataSource] = useState([]);
  const windowHeight = useRef(null)
  const listRef = useRef(null)

  // 处理分组数据
  useEffect(() => {
      if (!data?.length) {
        resetAllData()
      } else {
        const arr = arrTrans(10, data)
        const { changeInfo } = indexStore

        if (changeInfo) {
          const { type, thread } = changeInfo
          if (type === 'delete' || type === 'add' || type === 'edit') {
            let newArr = [ ...dataSource ];
            const threadId = type === 'delete' ? thread : thread.threadId
            const { pIndex, sIndex } = getThreadInfo(threadId)
            if ((pIndex !== -1 && sIndex !== -1) || type === 'add') {
              if (type === 'delete') {
                newArr[pIndex].splice(sIndex, 1)
              } else if (type === 'add') {
                newArr[0].unshift(thread)
              } else if (type === 'edit') {
                newArr[pIndex][sIndex] = thread
              }
  
              setDataSource(newArr) 
            }
          }
        } else {
          const length = arr.length
          const newArr = dataSource.slice()
          if (length && data.length > arrLength) {
            newArr.push(arr[length - 1]) 
            setDataSource(arr)    
          }
        }
      }

      indexStore.changeInfo = null
  }, [data?.length, indexStore.changeInfo])


  const getThreadInfo = (threadId) => {
    let pIndex = -1
    let sIndex = -1
    let newArr = [ ...dataSource ];
    newArr.forEach((subArr, index) => {
      for(let i = 0; i < subArr.length; i++) {
        if(subArr[i].threadId === threadId) {
          pIndex = index
          sIndex = i
        }
      }
    });

    return { pIndex, sIndex }
  }

  const arrLength = useMemo(() => {
    let length = 0
    dataSource.forEach(item => {
      length += item.length
    })
    return length
  }, [dataSource])

//   通知子组件去监听
  useEffect(() => {
    if (dataSource?.length && listRef?.current) {
        const length = dataSource.length - 1
        const { displays } = listRef.current.state
        if (dataSource?.length > displays?.length) {
            setTimeout(() => {
                listRef?.current?.observePage(length)
            }, 10);
        }
    }
  }, [dataSource, listRef?.current])

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
      <>
        {
            !isClickTab && <List 
                ref={(e) => { listRef.current = e }}
                dataSource={dataSource} 
                wholePageIndex={wholePageIndex} 
                windowHeight={windowHeight.current} 
                dispatch={dispatch}
                isClickTab={isClickTab}
            />
        }
      </>
    
  );
}

export default inject('index')(observer(VirtualList));
