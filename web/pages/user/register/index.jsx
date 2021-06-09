import React from 'react';
import RegisterH5Page from '@layout/user/h5/register';
import ViewAdapter from '@components/view-adapter';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@middleware/HOCWithNoLogin';
import HOCLoginMode from '@middleware/HOCLoginMode';

class Register extends React.Component {
  render() {
    return <ViewAdapter
              h5={<RegisterH5Page/>}
              pc={<RegisterH5Page/>}
              title={`注册 - ${this.props.site?.siteName}`}
            />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(HOCLoginMode('register')(Register)));
