import React, { useEffect, useRef, forwardRef, useState } from 'react';
import { List, WindowScroller, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
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

function VList({ hasNextPage, isNextPageLoading, list = [], loadNextPage, ...otherPorps }, ref) {
  const [isLoading, setIsLoading] = useState(false);

  const cache = new CellMeasurerCache({
    defaultHeight: 150,
    fixedWidth: true,
  });

  const rowCount = hasNextPage ? list.length + 1 : list.length;

  let listRef = useRef(null);
  const immutableHeightMap = {}; // 不可变的高度
  const variableHeightMap = {}; // 可变的高度

  // 获取每一行元素的高度
  const getRowHeight = ({ index }) => {
    const data = list[index];

    // 获取不可变的元素高度
    const immutableHeight = getImmutableTypeHeight(data);
    immutableHeightMap[index] = immutableHeight;

    const variableHeight = variableHeightMap[index] || 0;

    const rowHeight = immutableHeight + variableHeight + 10;

    return rowHeight;
  };

  // 重新计算指定的行高
  const recomputeRowHeights = (index) => {
    listRef.recomputeRowHeights(index);
  };

  const onContentHeightChange = (height, index) => {
    variableHeightMap[index] = height;
    recomputeRowHeights(index);
  };

  // 行渲染
  const rowRenderer = ({ index, key, style }) => {
    const { height, ...otherStyles } = style;
    const item = list[index];
    const content = (
      <ThreadContent
        onContentHeightChange={(height) => onContentHeightChange(height, index)}
        key={index}
        showBottomStyle={index !== list.length - 1}
        data={item}
        className={styles.listItem}
        recomputeRowHeights={() => recomputeRowHeights(index)}
      />
    );

    const newStyle = {
      height: `${height / 100}rem`,
      ...otherStyles,
    };

    return (
      <div key={key} style={newStyle} data-height={variableHeightMap[index]} data-index={index} data-key={key}>
        {content}
      </div>
    );
  };

  // 行渲染
  const rowRendererCache = ({ index, isScrolling, key, parent, style }) => {
    const item = list[index];

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {({ measure }) => (
          <div key={key} style={style} data-height={variableHeightMap[index]} data-index={index} data-key={key}>
            <ThreadContent
              onContentHeightChange={() => measure()}
              key={index}
              showBottomStyle={index !== list.length - 1}
              data={item}
              className={styles.listItem}
              recomputeRowHeights={() => recomputeRowHeights(index)}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  // 滚动事件
  const onScroll = ({ scrollTop }) => {
    const totalHeight = listRef.Grid.getTotalRowsHeight();
    console.log(scrollTop, totalHeight);
    if (scrollTop + 300 > totalHeight) {
      console.log('加载下一页');
      loadNextPage();
    }
  };

  // 滚动事件
  const onChildScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
    if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
      console.log('加载下一页');
      setIsLoading(true);
      loadNextPage().finally(() => {
        setIsLoading(false);
      });
    }
  };

  const cacheListScroller = (
    <List
      height={1020}
      ref={(ref) => (listRef = ref)}
      style={{ width: '100%' }}
      width={500}
      onScroll={onChildScroll}
      overscanRowCount={10}
      rowCount={rowCount}
      deferredMeasurementCache={cache}
      rowHeight={cache.rowHeight}
      rowRenderer={rowRendererCache}
    />
  );

  const listScroller = (
    <List
      height={1020}
      ref={(ref) => (listRef = ref)}
      style={{ width: '100%' }}
      width={500}
      onScroll={onChildScroll}
      overscanRowCount={10}
      rowCount={rowCount}
      rowRenderer={rowRenderer}
      rowHeight={getRowHeight}
    />
  );

  const windowScroller = (
    <WindowScroller onScroll={onScroll}>
      {({ height, width, isScrolling, registerChild }) => (
        <div>
          {otherPorps.children}
          <div>
            <List
              autoHeight={true}
              height={height}
              isScrolling={isScrolling}
              ref={(ref) => (listRef = ref)}
              style={{ width: '100%', overflowY: 'hidden' }}
              width={width}
              onScroll={onChildScroll}
              overscanRowCount={10}
              rowCount={rowCount}
              rowRenderer={rowRenderer}
              rowHeight={getRowHeight}
            />
          </div>
          <div className={styles.bottomViewBox}>
            <BottomView></BottomView>
          </div>
        </div>
      )}
    </WindowScroller>
  );

  const autoWindowScroller = (
    <WindowScroller onScroll={onScroll}>
      {({ height, isScrolling, scrollTop, onChildScroll }) => (
        <AutoSizer disableHeight={true}>
          {({ width }) => (
            <List
              autoHeight={true}
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              overscanRowCount={10}
              ref={(el) => {
                listRef = el;
              }}
              rowCount={rowCount}
              rowRenderer={rowRenderer}
              rowHeight={getRowHeight}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );

  return (
    <div className={styles.container}>
      <div>{otherPorps.children}</div>
      <div className="listWrapper">{listScroller}</div>
      <div className={styles.bottomViewBox}>
        <BottomView></BottomView>
      </div>
    </div>
  );
}

export default forwardRef(VList);
