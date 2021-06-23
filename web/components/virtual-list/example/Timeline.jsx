import React from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  WindowScroller
} from 'react-virtualized'
import { listItems } from './listItems'
import { Tweet } from './Tweet'

export default class RVComponents extends React.Component {
  _renderCache = new CellMeasurerCache({ defaultHeight: 85, fixedWidth: true })
  _mostRecentWidth = 0
  _resizeAllFlag = false
  _renderInfiniteLoaderRef
  _renderListRef

  state = {
    tweets: listItems,
    isLoading: false
  }

  componentDidUpdate(prevProps, prevState) {
    const prevTweetList = prevState.tweets
    const updatedTweetList = this.state.tweets

    if (this._resizeAllFlag) this._reSizeAllRender()

    if (prevTweetList !== updatedTweetList) {
      const index = prevTweetList.length
      this._reSizeRowRender(index)
    }
  }

  _rowCount = () =>
    !this.state.isLoading
      ? this.state.tweets.length + 1
      : this.state.tweets.length

  _loadMoreRows = this.state.isLoading
    ? () => Promise.resolve()
    : () =>
        Promise.resolve().then(() => {
          this.setState({
            isLoading: true
          })

          const prevTweets = this.state.tweets

          setTimeout(() => {
            this.setState({
              tweets: [...prevTweets, ...listItems],
              isLoading: false
            })
          }, 600)
        })

  _isRowLoaded = ({ index }) => {
    return !!this.state.tweets[index]
  }

  _renderRow = ({ index, key, parent, style }) => {
    const tweet = this.state.tweets[index]

    return (
      <CellMeasurer
        cache={this._renderCache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}>
        {({ measure }) => (
          <div style={style} className="row">
            {this._isRowLoaded({ index }) ? (
              <Tweet
                key={tweet.created_at}
                measure={measure}
                index={index}
                {...tweet}
              />
            ) : (
              <div>loading</div>
            )}
          </div>
        )}
      </CellMeasurer>
    )
  }

  render() {
    console.log('Total render tweets', this.state.tweets.length)

    return (
      <div>
        <div className="count">Loaded tweets: {this.state.tweets.length}</div>
        <div className="infWrapper">
          <InfiniteLoader
            isRowLoaded={this._isRowLoaded}
            loadMoreRows={this._loadMoreRows}
            ref={el => (this._renderInfiniteLoaderRef = el)}
            rowCount={this._rowCount()}
            threshold={0}
            minimumBatchSize={1}>
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop, onChildScroll }) => (
                  <AutoSizer disableHeight={true} onResize={this._onResize}>
                    {({ width }) => (
                      <List
                        autoHeight={true}
                        deferredMeasurementCache={this._renderCache}
                        height={height}
                        isScrolling={isScrolling}
                        onRowsRendered={onRowsRendered}
                        onScroll={onChildScroll}
                        overscanRowCount={5}
                        ref={el => {
                          this._renderListRef = el
                          registerChild(el)
                        }}
                        rowHeight={this._renderCache.rowHeight}
                        rowRenderer={this._renderRow}
                        rowCount={this._rowCount() + 1}
                        scrollTop={scrollTop}
                        width={width}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    )
  }

  _onResize = ({ width }) => {
    console.log(width)
    console.log(this._mostRecentWidth)
    console.log(this._resizeAllFlag)

    if (this._mostRecentWidth && this._mostRecentWidth !== width) {
      this._resizeAllFlag = true
      process.nextTick(this._reSizeAllRender)
    }

    this._mostRecentWidth = width
  }

  _reSizeAllRender = () => {
    console.warn('RECALC!')

    this._resizeAllFlag = false
    this._renderCache.clearAll()
    if (this._renderListRef) {
      this._renderListRef.recomputeRowHeights()
    }
  }

  _reSizeRowRender = index => {
    this._renderCache.clear(index, 0)
    if (this._renderListRef) this._renderListRef.recomputeRowHeights(index)
  }
}
