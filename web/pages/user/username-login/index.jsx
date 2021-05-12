import React from 'react';
import UsernameH5Login from '@layout/user/h5/username-login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class UsernameLogin extends React.Component {
  render() {
    return <UsernameH5Login />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(UsernameLogin);
