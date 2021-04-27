import React from 'react';
import WeixinBindQrCodePage from '@layout/user/h5/wx-bind-qrcode';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCLoginMode from '@common/middleware/HOCLoginMode';

@inject('site')
class WeixinBind extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <WeixinBindQrCodePage /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(WeixinBind));
