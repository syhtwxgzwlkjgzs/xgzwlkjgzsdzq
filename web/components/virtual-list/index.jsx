import React, { useEffect, useRef, useState } from 'react';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';
import { getImmutableTypeHeight } from './utils';
import BottomView from './BottomView';

/**
 * 列表组件，集成上拉刷新能力
 * @prop {function} className 容器样式，用于确定list高度；必传
 * @param {string} noMore 无更多数据
 * @prop {function} onRefresh 触底触发事件，需返回promise；若没有声明onRefresh，不触发上拉刷新。
 * @prop {function} onScroll 滑动事件
 * @prop {string} wrapperClass 内部元素className
 * @prop {boolean} showRefresh 是否展示loading视图
 * @prop {function} onError 当onRefresh返回reject时，触发回调
 * @prop {boolean} enableError 是否启用reject捕获
 * @prop {boolean} immediateCheck 初始化的时候，是否立即请求一次
 * @prop {function} resetList 初始化list状态
 */

export default function VList({ hasNextPage, isNextPageLoading, list = [], loadNextPage }) {
  const rowCount = hasNextPage ? list.length + 1 : list.length;
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  let listRef = useRef(null);
  const immutableHeightMap = {}; // 不可变的

  const variableHeightMap = {}; // 可变的

  const getRowHeight = ({ index }) => {
    const data = list[index];

    // 获取不可变的元素高度
    const immutableHeight = getImmutableTypeHeight(data);
    immutableHeightMap[index] = immutableHeight;

    const variableHeight = variableHeightMap[index] || 35;

    const rowHeight = immutableHeight + variableHeight + 10;

    console.log('rowHeight', rowHeight);

    return rowHeight;
  };

  const onContentHeightChange = (height, index) => {
    variableHeightMap[index] = height;
    listRef.recomputeRowHeights(index);
  };

  const rowRenderer = ({ index, key, style }) => {
    // console.log(style);

    const item = list[index];
    const content = (
      <ThreadContent
        onContentHeightChange={(height) => onContentHeightChange(height, index)}
        key={index}
        showBottomStyle={index !== list.length - 1}
        data={item}
        className={styles.listItem}
      />
    );

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  const autoSizer = (
    <AutoSizer>
      {({ width, height }) => (
        <List
          ref={(ref) => (listRef = ref)}
          width={width}
          autoHeight={true}
          overscanRowCount={10}
          rowCount={rowCount}
          rowRenderer={rowRenderer}
          rowHeight={getRowHeight}
        />
      )}
    </AutoSizer>
  );

  const windowScroller = (
    <WindowScroller>
      {({ height, width, isScrolling, onChildScroll, scrollTop }) => (
        <List
          autoHeight
          height={height}
          ref={(ref) => (listRef = ref)}
          style={{ width: '100%' }}
          width={width}
          overscanRowCount={10}
          rowCount={rowCount}
          rowRenderer={rowRenderer}
          rowHeight={getRowHeight}
        />
      )}
    </WindowScroller>
  );

  return (
    <div className={styles.container}>
      {windowScroller}

      <div className={styles.bottomViewBox}>
        <BottomView></BottomView>
      </div>
    </div>
  );

  //   return (
  //     <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
  //       {({ onRowsRendered, registerChild }) => (
  //         <AutoSizer>
  //           {({ width, height }) => <List width={width} height={height} rowHeight={200} rowRenderer={rowRenderer} />}
  //         </AutoSizer>
  //       )}
  //     </InfiniteLoader>
  //   );
}
