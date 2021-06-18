import React, { useRef, forwardRef, useState } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import styles from '../index.module.scss';
import { getImmutableTypeHeight } from '../utils';
import BottomView from '../BottomView';
import ThreadContent from '@components/thread';

function VList({ hasNextPage, isNextPageLoading, list = [], loadNextPage, ...otherPorps }, ref) {
  const [isLoading, setIsLoading] = useState(false);

  const cache = new CellMeasurerCache({
    defaultWidth: 100,
    minWidth: 75,
  });

  const rowCount = hasNextPage ? list.length + 1 : list.length;

  let listRef = useRef(null);
  const immutableHeightMap = {}; // 不可变的高度
  const variableHeightMap = {}; // 可变的高度

  // 获取每一行元素的高度
  const getRowHeight = ({ index }) => {
    const data = list[index];

    if (index === 0) {
      return 229;
    }

    if (index === list.length - 1) {
      return 100;
    }

    // 获取不可变的元素高度
    const immutableHeight = getImmutableTypeHeight(data);
    immutableHeightMap[index] = immutableHeight;

    const variableHeight = variableHeightMap[index] || 0;

    const rowHeight = immutableHeight + variableHeight + 10;

    return rowHeight;
  };

  // useEffect(() => {
  //   if (listRef) {
  //     listRef.scrollToRow(5);
  //   }
  // }, [listRef]);

  // 重新计算指定的行高
  const recomputeRowHeights = (index) => {
    listRef?.recomputeRowHeights(index);
  };

  const onContentHeightChange = (height, index) => {
    variableHeightMap[index] = height;
    recomputeRowHeights(index);
  };

  // 行渲染
  const rowRenderer = ({ index, key, parent, style }) => {
    const item = list[index];

    // 头部
    if (index === 0) {
      return (
        <CellMeasurer style={style} cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
          {otherPorps.children}
        </CellMeasurer>
      );
    }

    // 底部加载
    if (index === list.length - 1) {
      return (
        <CellMeasurer style={style} cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
          <BottomView></BottomView>
        </CellMeasurer>
      );
    }

    return (
      <CellMeasurer style={style} cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure, registerChild }) => (
          <ThreadContent
            onContentHeightChange={measure}
            key={index}
            data={item}
            className={styles.listItem}
            recomputeRowHeights={() => recomputeRowHeights(index)}
          />
        )}
      </CellMeasurer>
    );
  };

  // 滚动事件
  const onChildScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
    if (scrollTop + clientHeight + 50 >= scrollHeight && !isLoading) {
      console.log('加载下一页');
      setIsLoading(true);
      loadNextPage().finally(() => {
        setIsLoading(false);
      });
    }
  };

  const listScroller = (
    <AutoSizer className={styles.list}>
      {({ height, width }) => (
        <List
          height={height}
          ref={(ref) => (listRef = ref)}
          style={{ width: '100%', height: '100vh' }}
          width={500}
          onScroll={onChildScroll}
          overscanRowCount={10}
          rowCount={rowCount}
          deferredMeasurementCache={cache}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  );

  return (
    <div className={styles.container}>
      {listScroller}
    </div>
  );
}

export default forwardRef(VList);
