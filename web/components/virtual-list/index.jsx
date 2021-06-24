import React, { useEffect, useRef, forwardRef, useState, useImperativeHandle } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import styles from './index.module.scss';
import { getImmutableTypeHeight, getSticksHeight } from './utils';
import BottomView from './BottomView';

function VList({ hasNextPage, isNextPageLoading, list = [], sticks = [], loadNextPage, onScroll, ...otherPorps }, ref) {
  const [isLoading, setIsLoading] = useState(false);

  const rowCount = hasNextPage ? list.length + 1 : list.length;

  const header = {
    type: 'header',
  };
  const footer = {
    type: 'footer',
  };

  const [vList, setVList] = useState([header, footer]);

  let scrollToPosition = 0;

  let listRef = useRef(null);
  const immutableHeightMap = {}; // 不可变的高度
  const variableHeightMap = {}; // 可变的高度

  useEffect(() => {
    if (listRef) {
      listRef.scrollToPosition(scrollToPosition);
    }
  }, []);

  useEffect(() => {
    setVList([header, ...list, footer]);
  }, [list]);

  useEffect(() => {
    recomputeRowHeights(0);
  }, [sticks]);

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

    // 获取不可变的元素高度
    const immutableHeight = getImmutableTypeHeight(data);
    immutableHeightMap[index] = immutableHeight;

    const variableHeight = variableHeightMap[index] || 0;

    const rowHeight = immutableHeight + variableHeight + 10;

    return rowHeight;
  };

  // 行渲染
  const rowRenderer = ({ index, key, style }) => {
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
        <div style={style} className={styles.bottomViewBox} data-type="footer">
          <BottomView></BottomView>
        </div>
      );
    }

    const content = otherPorps.renderItem(item, index, recomputeRowHeights, onContentHeightChange);

    const newStyle = {
      height,
      ...otherStyles,
    };

    return (
      <div key={key} style={newStyle} data-index={index} data-key={key} data-height={variableHeightMap[index]}>
        {content}
        <div style={dividerStyle}></div>
      </div>
    );
  };

  // 重新计算指定的行高
  const recomputeRowHeights = (index) => {
    listRef?.recomputeRowHeights(index);
  };

  const onContentHeightChange = (height, index) => {
    variableHeightMap[index] = height;
    recomputeRowHeights(index);
  };

  // 滚动事件
  const onChildScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
    scrollToPosition = scrollTop;

    onScroll({ scrollTop, clientHeight, scrollHeight });
    // onListScroll({ scrollTop, clientHeight, scrollHeight });
    if (scrollTop + clientHeight + 50 >= scrollHeight && !isLoading) {
      setIsLoading(true);
      loadNextPage().finally(() => {
        setIsLoading(false);
      });
    }
  };

  const listScroller = (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          ref={(ref) => (listRef = ref)}
          width={width}
          onScroll={onChildScroll}
          overscanRowCount={10}
          rowCount={rowCount}
          rowRenderer={rowRenderer}
          rowHeight={getRowHeight}
        />
      )}
    </AutoSizer>
  );

  useImperativeHandle(ref, () => ({
    listRef,
  }));

  return <div className={styles.container}>{listScroller}</div>;
}

export default forwardRef(VList);
