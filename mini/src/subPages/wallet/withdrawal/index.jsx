import React from 'react';
import Withdrawal from '@layout/wallet/withdrawal';
import { readWalletUser } from '@server';
import Page from '@components/page';
// import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';

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
    return (
      <Page>
        <Withdrawal walletData={this.state.walletData} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default WalletPage;
