import React from 'react';
import styles from './index.module.scss';

class Profile extends React.Component {
  render() {
    return (
      <div className='index'>
        <h1>我的资料</h1>
        <p className={styles.text}>33333</p>
      </div>
    );
  }
}

export default Profile;
