import React from 'react';
import RegisterH5Page from '@layout/user/h5/register';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@common/middleware/HOCWithNoLogin';
import HOCLoginMode from '@common/middleware/HOCLoginMode';

@inject('site')
class Register extends React.Component {
  render() {
    return <RegisterH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('register')(Register));
