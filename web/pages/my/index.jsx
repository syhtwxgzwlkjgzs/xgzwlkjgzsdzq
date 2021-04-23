import React from 'react';
import styles from './index.module.scss';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithLogin from '@common/middleware/HOCWithLogin';


class MyCenter extends React.Component {
  render() {
    return (
      <div className='index'>
        <h1>个人中心</h1>
        <p className={styles.text}>33333</p>
      </div>
    );
  }
}

export default HOCFetchSiteData(HOCWithLogin(MyCenter));
