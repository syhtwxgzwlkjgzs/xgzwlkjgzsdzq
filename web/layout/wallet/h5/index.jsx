import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import layout from './layout.module.scss';

import WalletInfo from './components/wallet-info';

// import { Icon, Input, Badge, Toast, Button } from '@discuzq/design';


@observer
class WalletH5Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onFrozenAmountClick() {
    console.log('点击了冻结金额');
  }

  render() {
    return (
        <div className={layout.container}>
          <div className={layout.header}>
            <WalletInfo webPageType='h5' onFrozenAmountClick={() => this.onFrozenAmountClick()}></WalletInfo>
          </div>
        </div>
    );
  }
}

export default withRouter(WalletH5Page);
