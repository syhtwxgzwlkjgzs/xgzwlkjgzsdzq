import React from 'react';
import H5Login from '@layout/user/h5/login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@common/middleware/HOCWithNoLogin';

@inject('site')
class Login extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <H5Login></H5Login> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Login);
