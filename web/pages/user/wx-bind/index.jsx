import React from 'react';
import WeixinBindH5Page from '@layout/user/h5/wx-bind';
import { inject } from 'mobx-react';

import HOCLoginMode from '@middleware/HOCLoginMode';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class WeixinBind extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <WeixinBindH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(WeixinBind));
