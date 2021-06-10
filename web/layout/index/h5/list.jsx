import React, { useEffect, useRef, useState } from 'react';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';

export default function VList({
  /** Are there more items to load? (This information comes from the most recent API request.) */
  hasNextPage,
  /** Are we currently loading a page of items? (This may be an in-flight flag in your Redux store for example.) */
  isNextPageLoading,
  /** List of items loaded so far */
  list = [],
  /** Callback function (eg. Redux action-creator) responsible for loading the next page of items */
  loadNextPage,
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasNextPage ? list.length + 1 : list.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  let listRef = null;


  const getRowHeight = ({ index }) => {
      console.log(list[index]);
    return 200;
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
    <>
      <div style={{ height: 1000 }}>
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
    </>
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
