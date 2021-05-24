import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import WalletH5Page from '@layout/wallet/h5';
import WalletPCPage from '@layout/wallet/pc';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import { readWalletUser } from '@server';

@inject('wallet')
@inject('site')
class WalletPage extends React.Component {
  static async getInitialProps(ctx) {
    try {
      const walletInfoServerRes = await readWalletUser({}, ctx);
      if (walletInfoServerRes.code === 0) {
        return {
          serverWalletInfo: walletInfoServerRes.data,
        };
      }
      return {
        serverWalletInfo: null,
      };
    } catch (error) {
      console.error(error);
      return {
        serverWalletInfo: null,
      };
    }
  }

  componentDidMount() {
    if (this.props.serverWalletInfo) {
      this.props.wallet.walletInfo = this.props.serverWalletInfo;
    } else {
      this.props.wallet.getUserWalletInfo();
    }
  }

  render() {
    const { site, wallet } = this.props;
    const { platform } = site;
    const { walletInfo } = wallet;
    return platform === 'h5'
      ? <WalletH5Page walletData={walletInfo} /> : <WalletPCPage walletData={walletInfo} />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(WalletPage));
