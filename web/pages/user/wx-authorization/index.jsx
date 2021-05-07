import React from 'react';
import WXAuthorizationPage from '@layout/user/h5/wx-authorization';
import { inject } from 'mobx-react';

import HOCLoginMode from '@common/middleware/HOCLoginMode';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class WXAuthorization extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <WXAuthorizationPage /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(WXAuthorization));
