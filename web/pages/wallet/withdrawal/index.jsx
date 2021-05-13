import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import Withdrawal from '@layout/wallet/withdrawal';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import { readWalletUser } from '@server';

class WalletPage extends React.Component {
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
    return <Withdrawal walletData={this.state.walletData} />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(WalletPage));
