import React from 'react';
import ResetPasswordH5Page from '@layout/user/h5/reset-password';
import { inject } from 'mobx-react';

import HOCLoginMode from '@common/middleware/HOCLoginMode';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class ResetPassword extends React.Component {
  render() {
    return <ResetPasswordH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('phone')(ResetPassword));
