import React from 'react';
import Thread from '@components/thread';
import styles from './index.module.scss';

class UserCenterThreads extends React.Component {
  render() {
    return (
      <div
        onRefresh={() => new Promise((resolve) => {
          setTimeout(() => {
            console.log('123');
            resolve(123);
          }, 2000);
        })
        }
        // noMore={true}
      >
        {this.props.data.map((itemInfo, index) => (
          <div key={index} className={index === 0 ? styles.threadFirstItem : styles.threadItem}>
            <Thread data={itemInfo} />
          </div>
        ))}
      </div>
    );
  }
}

export default UserCenterThreads;
