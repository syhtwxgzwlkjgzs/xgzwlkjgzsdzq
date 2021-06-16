import React from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List, WindowScroller } from 'react-virtualized';
import { listItems } from './listItems';
import { Tweet } from './Tweet';

import ThreadContent from '@components/thread';
import { observer } from 'mobx-react';


export default class RVComponents extends React.Component {
  renderCache = new CellMeasurerCache({ defaultHeight: 85, fixedWidth: true });
  mostRecentWidth = 0;
  resizeAllFlag = false;
  renderInfiniteLoaderRef;
  renderListRef;

  state = {
    tweets: listItems,
    isLoading: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevTweetList = prevState.tweets;
    const updatedTweetList = this.state.tweets;

    if (this.resizeAllFlag) this.reSizeAllRender();

    if (prevTweetList !== updatedTweetList) {
      const index = prevTweetList.length;
      this.reSizeRowRender(index);
    }
  }

  rowCount = () => (!this.state.isLoading ? this.state.tweets.length + 1 : this.state.tweets.length);

  loadMoreRows = this.state.isLoading
    ? () => Promise.resolve()
    : () =>
        Promise.resolve().then(() => {
          this.setState({
            isLoading: true,
          });

          const prevTweets = this.state.tweets;

          setTimeout(() => {
            this.setState({
              tweets: [...prevTweets, ...listItems],
              isLoading: false,
            });
          }, 600);
        });

  isRowLoaded = ({ index }) => {
    return !!this.state.tweets[index];
  };

  renderRow = ({ index, key, parent, style }) => {
    const tweet = this.state.tweets[index];

    return (
      <CellMeasurer cache={this.renderCache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {({ measure }) => (
          <div style={style} className="row">
            {this.isRowLoaded({ index }) ? (
              <Tweet key={tweet.created_at} measure={measure} index={index} {...tweet} />
            ) : (
              <div>loading</div>
            )}
          </div>
        )}
      </CellMeasurer>
    );
  };

  onScroll({scrollTop}) {
    console.log(123, scrollTop);
  }

  render() {
    console.log('Total render tweets', this.state.tweets.length);

    return (
      <div>
        <div>{this.props.children}</div>
        <div className="infWrapper">
              <WindowScroller onScroll={this.onScroll}>
                {({ height, isScrolling, scrollTop, onChildScroll }) => (
                  <AutoSizer disableHeight={true} onResize={this._onResize}>
                    {({ width }) => (
                      <List
                        autoHeight={true}
                        deferredMeasurementCache={this.renderCache}
                        height={height}
                        onScroll={onChildScroll}
                        overscanRowCount={5}
                        ref={(el) => {
                          this.renderListRef = el;
                        }}
                        rowHeight={this.renderCache.rowHeight}
                        rowRenderer={this.renderRow}
                        rowCount={this.rowCount() + 1}
                        scrollTop={scrollTop}
                        width={width}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
        </div>
      </div>
    );
  }

  _onResize = ({ width }) => {
    console.log(width);
    console.log(this.mostRecentWidth);
    console.log(this.resizeAllFlag);

    if (this.mostRecentWidth && this.mostRecentWidth !== width) {
      this.resizeAllFlag = true;
      process.nextTick(this.reSizeAllRender);
    }

    this.mostRecentWidth = width;
  };

  reSizeAllRender = () => {
    console.warn('RECALC!');

    this.resizeAllFlag = false;
    this.renderCache.clearAll();
    if (this.renderListRef) {
      this.renderListRef.recomputeRowHeights();
    }
  };

  reSizeRowRender = (index) => {
    this.renderCache.clear(index, 0);
    if (this.renderListRef) this.renderListRef.recomputeRowHeights(index);
  };
}
