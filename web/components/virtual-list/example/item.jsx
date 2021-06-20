import React from 'react';
import ThreadContent from '@components/thread';
import { observer } from 'mobx-react';

@observer
export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this._measure = this._measure.bind(this);
  }

  componentDidMount() {
    this.props.measure();
  }

  componentDidMount() {
    this.props.measure();
  }

  _measure() {
    this.props.measure();
  }

  render() {
    const { data: item } = this.props;
    return (
        <ThreadContent
          onContentHeightChange={this._measure}
          onImageReady={this._measure}
          onVideoReady={this._measure}
          key={item.threadId}
          // showBottomStyle={index !== pageData.length - 1}
          data={item}
          // className={styles.listItem}
          recomputeRowHeights={this._measure}
        />
    );
  }
}
