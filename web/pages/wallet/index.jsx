import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import WalletH5Page from '@layout/wallet/h5';
import WalletPCPage from '@layout/wallet/pc';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import { readWalletUser } from '@server';

@inject('site')
class WalletPage extends React.Component {
  // static async getInitialProps(ctx) {
  //   console.log(ctx);
  //   const id = ctx?.query?.id;
  //   if (id) {
  //     const res = await readWalletUser({ params: { uid: Number(id) } });
  //     console.log(res);
  //   }
  // }

  constructor(props) {
    super(props);
    this.state = {
      walletData: null,
    };
  }

  async getWallet() {
    const res = await readWalletUser({ params: { uid: 1 } });
    if (res.code === 0) {
      await this.setState({ walletData: res.data });
    }
    console.log(res);
  }

  componentDidMount() {
    this.getWallet();
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5'
      ? <WalletH5Page walletData={this.state.walletData} /> : <WalletPCPage walletData={this.state.walletData} />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(WalletPage));
