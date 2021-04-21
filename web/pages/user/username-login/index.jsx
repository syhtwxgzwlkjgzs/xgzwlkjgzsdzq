import React from 'react';
import UsernameH5Login from '@layout/user/h5/username-login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@common/middleware/HOCWithNoLogin';

@inject('site')
class UsernameLogin extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <UsernameH5Login /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(UsernameLogin);
