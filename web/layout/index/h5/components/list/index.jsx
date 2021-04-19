import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PullDownRefresh, ScrollView } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 列表组件
 * @prop {function} onRefresh 刷新事件
 * @prop {function} onScrollBottom 到达底部事件
 * @prop {string} containerClassName 覆盖container className 用于设置list高度
 * @prop {boolean} refreshing 是否刷新中 必填 否则上面刷新块不会消失
 * @prop {Data[]} data 数据
 * @prop {function} renderItem 渲染行
 *  @param {{index:number, data: Data}} args 参数
 * ...props 其他ScrollView props
 */
const List = ({
  onRefresh,
  refreshing,
  chlidren,
  data = [],
  renderItem,
  onScrollBottom,
  containerClassName,
  loadMoreRows,
  ...props
}) => {
  const listRef = useRef();
  const [height, setHeight] = useState(0);
  const emptyFunction = useCallback(() => {}, []);
  const renderDiv = useCallback(() => <div />, []);
  const composeClassName = `${styles.container} ${containerClassName || styles.list}`;

  useEffect(() => {
    const el = listRef.current;

    if (el) {
      setHeight(el.clientHeight);
    }
  }, [listRef.current]);

  return (
    <div className={composeClassName} ref={listRef}>
      <div>
        <PullDownRefresh onRefresh={onRefresh} isFinished={!refreshing} height={height}>
          <ScrollView
            height={height}
            rowCount={data.length}
            rowData={data}
            rowRenderer={renderItem || renderDiv}
            renderBottom={renderDiv}
            isRowLoaded={emptyFunction}
            onPullingUp={emptyFunction}
            loadMoreRows={loadMoreRows}
            onScrollBottom={onScrollBottom}
            {...props}
          >
            {chlidren}
          </ScrollView>
        </PullDownRefresh>
      </div>
    </div>
  );
};

export default React.memo(List);
