import React from 'react';
import styles from './index.module.scss';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@common/middleware/HOCWithNoLogin';

class Login extends React.Component {
  render() {
    return (
      <div className='index'>
        <h1>login</h1>
        <p className={styles.text}>33333</p>
      </div>
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(Login));
