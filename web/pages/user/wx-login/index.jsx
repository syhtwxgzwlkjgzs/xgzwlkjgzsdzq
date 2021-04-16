import React from 'react';
import WXLoginH5Page from '@layout/user/h5/wx-login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class WXLogin extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <WXLoginH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(WXLogin);
