import React, { useRef, forwardRef, useState, useEffect } from 'react';
import './index.scss';
import Item from './item';
import BottomView from '../BottomView';
import styles from '../index.module.scss';
import { getSticksHeight } from '../utils';

import { List, CellMeasurer, CellMeasurerCache, AutoSizer, InfiniteLoader } from 'react-virtualized';
import { inject, observer } from 'mobx-react';

// @observer
// @inject('index')
// @inject('vlist')

function Home(props, ref) {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 150,
    show: false,
  });

  const [list, setList] = useState([{ type: 'header' }, ...(props.list || []), { type: 'footer' }]);
  let listRef = useRef(null);
  let loadData = false;
  const rowCount = list.length;

  useEffect(() => {
    setList([{ type: 'header' }, ...(props.list || []), { type: 'footer' }]);
  }, [props.list]);

  // componentDidMount() {
  //   setTimeout(() => {
  //     if (listRef) {
  //       listRef.scrollToPosition(props.vlist.home || 0);
  //     }
  //   }, 1000);
  // }

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
    return cache.rowHeight({ index });
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
                deferredMeasurementCache={cache}
                height={height}
                overscanRowCount={5}
                onRowsRendered={onRowsRendered}
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

export default forwardRef(Home);
