import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import WalletH5Page from '@layout/wallet/h5';
import WalletPCPage from '@layout/wallet/pc';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class WalletPage extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <WalletH5Page /> : <WalletPCPage />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(WalletPage));
