import React from 'react';
import styles from './index.module.scss';

import compose from '@common/utils/compose';
import clientFetchSiteData from '@common/middleware/clientFetchSiteData';
import serverFetchSiteData from '@common/middleware/serverFetchSiteData';


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
// export default clientFetchSiteData(Profile);

// export const getServerSideProps = (ctx) => compose([serverFetchSiteData, (ctx, data) => {
//   return {
//     props: {
//       ...data
//     }
//   }
// }],ctx);
