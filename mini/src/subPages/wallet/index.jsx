import React from 'react';
import { inject } from 'mobx-react';
import { getCurrentInstance } from '@tarojs/taro';
import Wallet from '../../layout/wallet/index';
import { readWalletUser } from '@server';


class WalletPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletData: null,
    };
  }
  
  componentDidMount() {
    this.getWallet();
  }

  getWallet = async () => {
    const res = await readWalletUser({ params: { uid: 1 } });
    if (res.code === 0) {
      await this.setState({ walletData: res.data });
    }
    console.log(res);
  }

  render() {
    return <Wallet walletData={this.state.walletData}></Wallet>
  }
}

export default WalletPage;
