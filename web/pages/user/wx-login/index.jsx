import React from 'react';
import WXLoginH5Page from '@layout/user/h5/wx-login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCLoginMode from '@common/middleware/HOCLoginMode';
import HOCWeixin from '@common/middleware/HOCWeixin';

@inject('site')
class WXLogin extends React.Component {
  render() {
    return <WXLoginH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(HOCWeixin(WXLogin)));
