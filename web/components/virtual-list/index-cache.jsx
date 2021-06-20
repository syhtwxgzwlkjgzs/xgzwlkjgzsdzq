import React, { useEffect, useRef, forwardRef, useState, useImperativeHandle } from 'react';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer, InfiniteLoader } from 'react-virtualized';
import styles from './index.module.scss';
import { getSticksHeight } from './utils';
import BottomView from './BottomView';

function VList(
  { noMore, requestError, defaultScrollTop = 0, list = [], sticks = [], loadNextPage, onScroll, ...otherPorps },
  ref,
) {
  const [isLoading, setIsLoading] = useState(false);

  const cache = new CellMeasurerCache({
    defaultHeight: 150,
    fixedWidth: true,
  });

  const rowCount = !noMore ? list.length + 1 : list.length;

  const header = {
    type: 'header',
    key: 'header',
  };
  const footer = {
    type: 'footer',
    key: 'footer',
  };

  const [vList, setVList] = useState([header, footer]);

  let scrollToPosition = defaultScrollTop;

  let listRef = useRef(null);

  useEffect(() => {
    if (listRef) {
      // console.log('defaultScrollTop', defaultScrollTop);
      listRef.scrollToPosition(scrollToPosition);
    }
  }, [defaultScrollTop, listRef]);

  useEffect(() => {
    setVList([header, ...list, footer]);
  }, [list]);

  useEffect(() => {
    recomputeRowHeights(0);
  }, [sticks]);

  // useEffect(()=>{
  //   listRef.scrollToPosition(scrollToPosition);
  // }, [listRef?.Grid?.getTotalRowsHeight()]);

  // 获取每一行元素的高度
  const getRowHeight = ({ index }) => {
    const data = vList[index];

    if (!data) {
      return 0;
    }
    // 头部
    if (data.type === 'header') {
      return 165 + 54 + 16 + getSticksHeight(sticks);
    }

    // 底部
    if (data.type === 'footer') {
      return 160;
    }
    return cache.rowHeight({ index });
  };

  // 行渲染
  const rowRenderer = ({ index, isScrolling, key, parent, style }) => {
    const { height, ...otherStyles } = style;
    const item = vList[index];

    if (!item) {
      return '';
    }

    const dividerStyle = {
      height: '10px',
      width: '100%',
      background: '#eff1f3',
      position: 'absolute',
      bottom: '0',
      left: '0',
    };

    // 头部数据
    if (item.type === 'header') {
      const headerStyle = {
        background: '#eff1f3',
        ...style,
      };

      return (
        <div key={key} style={headerStyle} data-type="header">
          {otherPorps.children}
          <div style={dividerStyle}></div>
        </div>
      );
    }

    // 底部加载
    if (item.type === 'footer') {
      return (
        <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
          {({ measure, registerChild }) => (
            <div style={style} className={styles.bottomViewBox} data-type="footer">
              <BottomView noMore={noMore} isError={requestError}></BottomView>
            </div>
          )}
        </CellMeasurer>
      );
    }

    const newStyle = {
      height,
      ...otherStyles,
    };

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure, registerChild }) => (
          <div key={key} style={newStyle} data-index={index} data-key={key} data-id={item.threadId}>
            {otherPorps.renderItem(item, index, recomputeRowHeights, onContentHeightChange, measure)}
            <div style={dividerStyle}></div>
          </div>
        )}
      </CellMeasurer>
    );
  };

  // 重新计算指定的行高
  const recomputeRowHeights = (index) => {
    listRef?.recomputeRowHeights(index);
  };

  const onContentHeightChange = (height, index) => {
    recomputeRowHeights(index);
  };

  // 滚动事件
  const onChildScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
    scrollToPosition = scrollTop;
    onScroll({ scrollTop, clientHeight, scrollHeight });
    // if (scrollTop + clientHeight + clientHeight / 2 >= scrollHeight && !isLoading) {
    //   console.log('加载下一页');
    //   setIsLoading(true);
    //   loadNextPage().finally(() => {
    //     setIsLoading(false);
    //   });
    // }
  };

  const isRowLoaded = ({ index }) => {
    if (!isLoading) {
      return false;
    } else {
      return true;
    }
  };

  const loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(123);
    let promiseResolver;

    setIsLoading(true);
    loadNextPage()
      .then(() => {
        promiseResolver();
      })
      .finally(() => {
        setIsLoading(false);
      });

    return new Promise((res) => {
      promiseResolver = res;
    });
  };
  console.log(list.length)
  const listScroller = (
    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={list.length}>
      {({ onRowsRendered, registerChild }) => {
        return (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                ref={(ref) => (listRef = ref)}
                width={width}
                onScroll={onChildScroll}
                overscanRowCount={12}
                deferredMeasurementCache={cache}
                onRowsRendered={onRowsRendered}
                rowCount={rowCount}
                rowRenderer={rowRenderer}
                rowHeight={getRowHeight}
              />
            )}
          </AutoSizer>
        );
      }}
    </InfiniteLoader>
  );

  useImperativeHandle(ref, () => ({
    listRef,
  }));

  return <div className={styles.container}>{listScroller}</div>;
}

export default forwardRef(VList);
