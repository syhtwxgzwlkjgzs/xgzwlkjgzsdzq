import React from 'react';
import BindPhoneH5Page from '@layout/user/h5/bind-phone';
import { inject } from 'mobx-react';

import HOCLoginMode from '@middleware/HOCLoginMode';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class BindPhone extends React.Component {
  render() {
    return <BindPhoneH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('phone')(BindPhone));
