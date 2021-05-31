import React from 'react';
import RegisterH5Page from '@layout/user/h5/register';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@middleware/HOCWithNoLogin';
import HOCLoginMode from '@middleware/HOCLoginMode';

class Register extends React.Component {
  render() {
    return <RegisterH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(HOCLoginMode('register')(Register)));
