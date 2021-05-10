import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { View } from '@tarojs/components';
import { Tabs, Button } from '@discuzq/design';
import Taro from '@tarojs/taro';

import layout from './layout.module.scss';

import WalletInfo from './components/wallet-info/index';
import IncomeList from './components/income-list/index';
import PayList from './components/pay-list/index';
import WithdrawalList from './components/withdrawal-list/index';
import NoMore from './components/no-more';



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
    Taro.navigateTo({url: '/subPages/wallet/frozen/index'});
  }
  
  // 切换选项卡
  onTabActive(val) {
    this.setState({ tabsType: val });
  }
  
  // 点击提现
  toWithrawal = () => {
    Taro.navigateTo({url: '/subPages/wallet/withdrawal/index'});
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
        <View className={layout.container}>
          <View className={layout.scroll}>
            <View className={layout.header}>
              <WalletInfo
                webPageType='h5'
                walletData={this.props.walletData}
                onFrozenAmountClick={() => this.onFrozenAmountClick()}
              >
              </WalletInfo>
            </View>
            <View className={layout.choiceTime}>
              <View className={layout.status}>全部状态</View>
              <View className={layout.status}>2012年4月</View>
            </View>
            <View className={layout.tabs}>
              <Tabs
                scrollable
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
            </View>
          </View>
          <View className={layout.footer}>
            <Button className={layout.button} onClick={this.toWithrawal} type='primary'>提现</Button>
          </View>
        </View>
    );
  }
}

export default withRouter(WalletH5Page);
