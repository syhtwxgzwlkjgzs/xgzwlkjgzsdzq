import React, { Component } from 'react';
import './index.scss';
import Item from './item';
import BottomView from '../BottomView';
import styles from '../index.module.scss';
import { getSticksHeight } from '../utils';

import { List, CellMeasurer, CellMeasurerCache, AutoSizer, InfiniteLoader } from 'react-virtualized';
import { inject, observer } from 'mobx-react';

@observer
@inject('index')
@inject('vlist')
export default class Home extends Component {
  constructor(props) {
    super(props);
    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 150,
      show: false,
    });

    const { threads = {}, sticks } = this.props.index;
    const { pageData = [] } = threads || {};
    this.state = {
      list: [{ type: 'header' }, [...pageData], { type: 'footer' }],
      wait: 0,
    };

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this._isRowLoaded = this._isRowLoaded.bind(this);
    this._loadMoreRows = this._loadMoreRows.bind(this);
    this._getRowHeight = this._getRowHeight.bind(this);
    this._clearAllCache = this._clearAllCache.bind(this);

    this.listRef = null;
  }

  loadData = false;

  componentDidMount() {
    setTimeout(() => {
      if (this.listRef) {
        this.listRef.scrollToPosition(this.props.vlist.home || 0);
      }
    }, 1000);
  }

  // 获取每一行元素的高度
  _getRowHeight({ index }) {
    const data = this.state.list[index];

    if (!data) {
      return 0;
    }

    if (!data.type && !data.threadId) {
      return 0;
    }

    // 头部
    if (data.type === 'header') {
      return 165 + 56 + 16 + getSticksHeight(this.props.sticks);
    }

    // 底部
    if (data.type === 'footer') {
      return 160;
    }
    return this._cache.rowHeight({ index });
  }

  renderListItem(type, data, measure, { index, key, parent, style }) {
    switch (type) {
      case 'header':
        return this.props.children;
      case 'footer':
        return <BottomView noMore={this.props.noMore} isError={this.props.requestError}></BottomView>;
      default:
        return <Item data={data} measure={measure} />;
    }
  }

  rowRenderer({ index, key, parent, style }) {
    const data = this.state.list[index];

    if (!data) {
      return '';
    }

    if (!data.type && !data.threadId) {
      return '';
    }

    return (
      <CellMeasurer cache={this._cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {({ measure, registerChild }) => (
          <div ref={registerChild} key={key} style={style} data-index={index} data-key={key} data-id={data.threadId}>
            {this.renderListItem(data.type, data, measure, { index, key, parent, style })}
            {/* <div style={dividerStyle}></div> */}
          </div>

          //   <div style={style}>
          //     {this.renderListItem(data.type, data, measure, { index, key, parent, style })}
          //   </div>
        )}
      </CellMeasurer>
    );
  }

  onScroll({ clientHeight, scrollHeight, scrollTop }) {
    this.props.vlist.setPosition(scrollTop);
    this.props.onScroll({ scrollTop, clientHeight, scrollHeight });
  }

  _isRowLoaded({ index }) {
    if (!this.loadData && this.state.list.length - index <= 5) {
      this.loadData = true;
      return false;
    } else {
      return true;
    }
  }

  _loadMoreRows({ startIndex, stopIndex }) {
    let promiseResolver;

    const { threads = {} } = this.props.index;
    const { currentPage, totalPage, pageData = [] } = threads || {};

    this.props.loadNextPage().then((res) => {
      const newList = [...this.state.list.slice(0, this.state.list.length - 2), ...pageData];
      newList.push({ type: 'footer' });
      this.setState(
        {
          list: newList,
        },
        () => {
          this.loadData = false;
          promiseResolver();
        },
      );
    });

    return new Promise((res) => {
      promiseResolver = res;
    });
  }

  _clearAllCache() {
    this._cache.clearAll();
  }

  render() {
    return (
      <div className="page">
        <InfiniteLoader
          isRowLoaded={this._isRowLoaded}
          loadMoreRows={this._loadMoreRows}
          rowCount={this.state.list.length}
        >
          {({ onRowsRendered, registerChild }) => {
            return (
              <AutoSizer className="list">
                {({ height, width }) => (
                  <List
                    ref={(ref) => {
                      this.listRef = ref;
                      registerChild(ref);
                    }}
                    onScroll={this.onScroll}
                    deferredMeasurementCache={this._cache}
                    height={height}
                    overscanRowCount={5}
                    onRowsRendered={onRowsRendered}
                    rowCount={this.state.list.length}
                    rowHeight={this._getRowHeight}
                    rowRenderer={this.rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            );
          }}
        </InfiniteLoader>
      </div>
    );
  }
}
