import React from 'react';
import Thread from '@components/thread';
import styles from './index.module.scss';
import { View } from '@tarojs/components';

class UserCenterThreads extends React.Component {
  static defaultProps = {
    showBottomStyle: true
  }
  
  render() {
    return (
      <View
        onRefresh={() => new Promise((resolve) => {
          setTimeout(() => {
            resolve(123);
          }, 2000);
        })
        }
        // noMore={true}
      >
        {this.props.data.map((itemInfo, index) => (
          <View key={index} className={index === 0 ? styles.threadFirstItem : styles.threadItem}>
            <Thread showBottomStyle={this.props.showBottomStyle} data={itemInfo} />
          </View>
        ))}
      </View>
    );
  }
}

export default UserCenterThreads;
