import React, { useRef, forwardRef, useState, useEffect } from 'react';
import './index.scss';
import Item from './item';
import BottomView from '../BottomView';

import { getImmutableTypeHeight, getSticksHeight } from '../utils';

import { List, CellMeasurer, CellMeasurerCache, AutoSizer, InfiniteLoader } from 'react-virtualized';
import { inject, observer } from 'mobx-react';

const immutableHeightMap = {}; // 不可变的高度

// 增强cache实例
function extendCache(instance) {
  instance.getDefaultHeight = ({ index, data }) => {
    if (!data) {
      return 0;
    }

    // 获取不可变的元素高度
    const immutableHeight = getImmutableTypeHeight(data);
    immutableHeightMap[index] = immutableHeight;

    const variableHeight = 0;

    const rowHeight = immutableHeight + variableHeight + 10;

    return rowHeight;
  };

  instance.rowHeight = ({ index, data }) => {
    const key = instance._keyMapper(index, 0);
    const height =
      instance._rowHeightCache[key] !== undefined
        ? instance._rowHeightCache[key]
        : instance.getDefaultHeight({ index, data });

    return height;
  };
}

function Home(props, ref) {
  let cache = props.vlist.cache;

  if (!cache) {
    cache = new CellMeasurerCache({
      fixedWidth: true,
      show: false,
    });

    extendCache(cache);
    props.vlist.setCache(cache);
  }

  const [list, setList] = useState([{ type: 'header' }, ...(props.list || []), { type: 'footer' }]);
  let listRef = useRef(null);
  let loadData = false;
  const rowCount = list.length;

  // 监听list列表
  useEffect(() => {
    setList([{ type: 'header' }, ...(props.list || []), { type: 'footer' }]);
  }, [props.list]);

  useEffect(() => {
    if (listRef) {
      listRef.scrollToPosition(props.vlist.home || 0);
    }
  }, [listRef?.Grid?.getTotalRowsHeight()]);

  // 获取每一行元素的高度
  const getRowHeight = ({ index }) => {
    const data = list[index];

    if (!data) {
      return 0;
    }

    // 头部
    if (data.type === 'header') {
      return 165 + 56 + 16 + getSticksHeight(props.sticks);
    }

    // 底部
    if (data.type === 'footer') {
      return 60;
    }
    return cache.rowHeight({ index, data });
  };

  const renderListItem = (type, data, measure, { index, key, parent, style }) => {
    switch (type) {
      case 'header':
        return props.children;
      case 'footer':
        return <BottomView noMore={props.noMore} isError={props.requestError}></BottomView>;
      default:
        return <Item data={data} measure={measure} />;
    }
  };

  const rowRenderer = ({ index, key, parent, style }) => {
    const data = list[index];

    if (!data) {
      return '';
    }

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {({ measure, registerChild }) => (
          <div ref={registerChild} key={key} style={style} data-index={index} data-key={key} data-id={data.threadId}>
            {renderListItem(data.type, data, measure, { index, key, parent, style })}
            {/* <div style={dividerStyle}></div> */}
          </div>
        )}
      </CellMeasurer>
    );
  };

  // 滚动事件
  const onScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
    // scrollToPosition = scrollTop;

    props.onScroll && props.onScroll({ scrollTop, clientHeight, scrollHeight });
    if (scrollTop !== 0) {
      props.vlist.setPosition(scrollTop);
    }

    if (scrollTop + clientHeight + 50 >= scrollHeight && !loadData) {
      loadData = true;
      props.loadNextPage().finally(() => {
        loadData = false;
      });
    }
  };

  const isRowLoaded = ({ index }) => !!list[index];

  const loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(!loadData);
    // if (!loadData) return;

    // let promiseResolver;

    // loadData = true;

    // props
    //   .loadNextPage()
    //   .then(() => {
    //     loadData = false;
    //     promiseResolver();
    //   })
    //   .finally(() => {
    //     console.log(loadData);
    //     loadData = false;
    //   });

    return new Promise((res) => {
      // promiseResolver = res;
    });
  };

  const clearAllCache = () => {
    cache.clearAll();
  };

  return (
    <div className="page">
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer className="list">
            {({ height, width }) => (
              <List
                ref={(ref) => {
                  listRef = ref;
                  registerChild(ref);
                }}
                onScroll={onScroll}
                overscanIndicesGetter={({
                  cellCount, 
                  overscanCellsCount, 
                  startIndex,
                  stopIndex,
                }) => {
                  return {
                    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
                    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
                  };
                }}
                deferredMeasurementCache={cache}
                height={height}
                overscanRowCount={5}
                onRowsRendered={(...props) => {
                  onRowsRendered(...props)
                }}
                rowCount={rowCount}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
}

export default observer(inject('vlist')(forwardRef(Home)));
