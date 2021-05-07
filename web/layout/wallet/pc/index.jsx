import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Header from '@components/header';
import Copyright from '@components/copyright';

import WalletInfo from './components/wallet-info/index';
import RecordList from './components/record-list/index';

import layout from './layout.module.scss';

@inject('site')
@observer
class ThreadPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <Header></Header>
        </div>
        <div className={layout.body}>
          {/* 左边内容 */}
          <div className={layout.bodyLeft}>
            <div className={layout.header}>
              <div>收入明细</div>
            </div>
            <div className={layout.choice}>
              <div className={layout.choiceLeft}>
                <div className={layout.choiceType}>2020年10月</div>
                <div className={layout.choiceType}>全部类型</div>
              </div>
              <div className={layout.recordNumber}>共有{16}条记录</div>
            </div>
            <div className={layout.recordList}>
              <RecordList></RecordList>
            </div>
          </div>

          {/* 右边信息 */}
          <div className={layout.bodyRigth}>
            <div className={layout.walletInfo}>
              <WalletInfo webPageType='PC'></WalletInfo>
            </div>
            <div className={layout.copyright}>
              <Copyright></Copyright>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
