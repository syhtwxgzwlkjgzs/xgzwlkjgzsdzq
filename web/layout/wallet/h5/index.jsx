import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import layout from './layout.module.scss';

import WalletInfo from './components/wallet-info/index';
import IncomeList from './components/income-list/index';
import PayList from './components/pay-list/index';
import WithdrawalList from './components/withdrawal-list/index';
import NoMore from './components/no-more';

import { Tabs, Icon, Button } from '@discuzq/design';


@observer
class WalletH5Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabsType: 'income',
    };
  }

  // 点击冻结金额
  onFrozenAmountClick() {
    this.props.router.push('/wallet/frozen');
  }

  // 切换选项卡
  onTabActive(val) {
    this.setState({ tabsType: val });
  }

  // 点击提现
  toWithrawal = () => {
    this.props.router.push('/wallet/withdrawal');
  }

  // 点击时间选择
  onSelectStatus = (type) => {
    if (type === 'select') {
      console.log('选择时间');
    } else {
      console.log('点击了全部状态');
    }
  }

  render() {
    const tabList = [
      ['income', '收入明细', null, { name: 'RedPacketOutlined' }],
      ['pay', '支出明细', null, { name: 'RedPacketOutlined' }],
      ['withdrawal', '提现记录', null, { name: 'RedPacketOutlined' }],
    ];

    // 伪造的数据incomeData、payData、withdrawalData
    const incomeData = [
      {
        id: 1,
        type: 0,
        money: 106,
        time: '2021-05-07 14:11:50',
      },
      {
        id: 2,
        type: 2,
        money: 86,
        time: '2021-05-01 14:11:50',
      },
      {
        id: 3,
        type: 4,
        money: 1446,
        time: '2021-04-07 14:11:50',
      },
      {
        id: 4,
        type: 4,
        money: 1446,
        time: '2021-04-07 14:11:50',
      },
      {
        id: 5,
        type: 5,
        money: 1446,
        time: '2021-04-07 14:11:50',
      },
      {
        id: 6,
        type: 5,
        money: 1446,
        time: '2021-04-07 14:11:50',
      },
    ];
    const payData = [
      {
        id: 1,
        type: 0,
        money: 106,
        time: '2021-05-07 14:11:50',
        payStatus: false,
      },
      {
        id: 2,
        type: 2,
        money: 86,
        time: '2021-05-01 14:11:50',
        payStatus: true,
      },
      {
        id: 3,
        type: 4,
        money: 1446,
        time: '2021-04-07 14:11:50',
        payStatus: false,
      },
    ];
    const withdrawalData = [
      {
        id: 1,
        money: 106,
        time: '2021-05-07 14:11:50',
        withdrawalStatus: 1,
        serialNumber: 123456789951,
      },
      {
        id: 2,
        money: 86,
        time: '2021-05-01 14:11:50',
        withdrawalStatus: 2,
        serialNumber: 1234541515951,
      },
      {
        id: 3,
        money: 1446,
        time: '2021-04-07 14:11:50',
        withdrawalStatus: 3,
        serialNumber: 123456654951,
      },
    ];

    return (
        <div className={layout.container}>
          <div className={layout.scroll}>
            <div className={layout.header}>
              <WalletInfo
                walletData={this.props.walletData}
                webPageType='h5'
                onFrozenAmountClick={() => this.onFrozenAmountClick()}
                >
              </WalletInfo>
            </div>
            <div className={layout.choiceTime}>
              <div className={layout.status} onClick={() => this.onSelectStatus('all')}>
                <span className={layout.text}>全部状态</span>
                <Icon name='UnderOutlined' size='6' className={layout.icon}></Icon>
              </div>
              <div className={layout.status} onClick={() => this.onSelectStatus('select')}>
                <span className={layout.text}>2012年4月</span>
                <Icon name='UnderOutlined' size='6' className={layout.icon}></Icon>
              </div>
            </div>
            <div className={layout.tabs}>
              <Tabs
                scrollable={true}
                className={layout.tabList}
                onActive={val => this.onTabActive(val)}
              >
              {tabList.map(([id, label, badge, icon]) => (
                <Tabs.TabPanel
                  key={id}
                  id={id}
                  label={label}
                  name={icon.name}
                >
                  {
                    this.state.tabsType === 'income'
                      ? incomeData.map(value => <IncomeList key={value.id} incomeVal={value}></IncomeList>) : ''
                  }
                  {
                    this.state.tabsType === 'pay'
                      ? payData.map(value => <PayList key={value.id} payVal={value}></PayList>) : ''
                  }
                  {
                    this.state.tabsType === 'withdrawal'
                      ? withdrawalData.map(value => <WithdrawalList key={value.id} withdrawalVal={value}></WithdrawalList>) : ''
                  }
                  <NoMore></NoMore>
                </Tabs.TabPanel>
              ))}
              </Tabs>
            </div>
          </div>
          <div className={layout.footer}>
            <Button className={layout.button} onClick={this.toWithrawal}>提现</Button>
          </div>
        </div>
    );
  }
}

export default withRouter(WalletH5Page);
