import React from 'react';
import BindPhoneH5Page from '@layout/user/h5/bind-phone';
import { inject } from 'mobx-react';

import HOCLoginMode from '@common/middleware/HOCLoginMode';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class BindPhone extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <BindPhoneH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('phone')(BindPhone));
