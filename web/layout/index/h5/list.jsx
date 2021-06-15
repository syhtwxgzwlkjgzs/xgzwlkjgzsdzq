import React, { useEffect, useRef, useState } from 'react';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';
import { getImmutableTypeHeight } from '@components/thread/utils';
import listStyle from './list.module.scss';

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
    console.log('immutableHeight', immutableHeight);

    // console.log('getRowHeight', variableHeightMap[index]);
    const variableHeight = variableHeightMap[index] || 35;
    console.log('variableHeight', variableHeight);

    const rowHeight = immutableHeight + variableHeight + 10;

    console.log('rowHeight', rowHeight);

    return rowHeight;
  };

  const onContentHeightChange = (height, index) => {
    variableHeightMap[index] = height;

    // console.log(index, height, listRef);
    listRef.recomputeRowHeights(index);
  };

  // Render a list item or a loading indicator.
  const rowRenderer = ({ index, key, style }) => {
    let content;

    if (!isRowLoaded({ index })) {
      content = 'Loading...';
    } else {
      const item = list[index];
      content = (
        <ThreadContent
          onContentHeightChange={(height) => onContentHeightChange(height, index)}
          key={index}
          showBottomStyle={index !== list.length - 1}
          data={item}
          className={styles.listItem}
        />
      );
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  return (
    <div className={listStyle.contianer}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={(ref) => (listRef = ref)}
            width={width}
            height={height}
            overscanRowCount={10}
            rowCount={rowCount}
            rowRenderer={rowRenderer}
            rowHeight={getRowHeight}
          />
        )}
      </AutoSizer>
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
