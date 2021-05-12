import React from 'react';
import WXSelectH5Page from '@layout/user/h5/wx-select';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCLoginMode from '@middleware/HOCLoginMode';

@inject('site')
class WXSelect extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <WXSelectH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(WXSelect));
