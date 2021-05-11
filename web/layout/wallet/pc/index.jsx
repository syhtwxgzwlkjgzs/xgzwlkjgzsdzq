import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Header from '@components/header';
import Copyright from '@components/copyright';
import { Icon } from '@discuzq/design';

import WalletInfo from './components/wallet-info/index';
import RecordList from './components/record-list/index';
import NoMore from './components/no-more';
import Tabs from './components/tabs';
import WithdrawalPop from './components/withdrawal-popup';

import layout from './layout.module.scss';

@inject('site')
@observer
class ThreadPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordData: [],
      type: 'income',
      showWithdrawalPopup: false, // 提现弹框是否显示
    };
    // 伪造的数据incomeData、payData、withdrawalData
    this.incomeData = [
      {
        id: 1,
        type: 0,
        money: 106,
        time: '2021-05-07 14:11:50',
      },
      {
        id: 7,
        type: 1,
        money: 86,
        time: '2021-05-01 14:11:50',
      },
      {
        id: 2,
        type: 2,
        money: 86,
        time: '2021-05-01 14:11:50',
      },
      {
        id: 3,
        type: 3,
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
        type: 6,
        money: 1446,
        time: '2021-04-07 14:02:10',
      },
    ];
    this.payData = [
      {
        id: 1,
        type: 0,
        money: 106,
        time: '2021-05-07 14:11:50',
        payStatus: false,
      },
      {
        id: 2,
        type: 1,
        money: 86,
        time: '2021-05-01 14:11:50',
        payStatus: true,
      },
      {
        id: 3,
        type: 2,
        money: 1446,
        time: '2021-04-07 14:11:50',
        payStatus: false,
      },
      {
        id: 4,
        type: 3,
        money: 106,
        time: '2021-05-07 14:11:50',
        payStatus: false,
      },
      {
        id: 5,
        type: 4,
        money: 86,
        time: '2021-05-01 14:11:50',
        payStatus: true,
      },
      {
        id: 6,
        type: 5,
        money: 1446,
        time: '2021-04-07 14:11:50',
        payStatus: false,
      },
    ];
    this.withdrawalData = [
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
      {
        id: 4,
        money: 146,
        time: '2021-04-07 14:11:50',
        withdrawalStatus: 0,
        serialNumber: 123456654951,
      },
    ];
  }

  async componentDidMount() {
    this.setState({
      recordData: this.incomeData,
    });
  }

  // 点击选择列表种类
  selectClick = (val) => {
    console.log(val);
    if (val === 'income') {
      this.setState({
        recordData: this.incomeData,
        type: val,
      });
    } else if (val === 'pay') {
      this.setState({
        recordData: this.payData,
        type: val,
      });
    } else {
      this.setState({
        recordData: this.withdrawalData,
        type: val,
      });
    }
    return true;
  }
  // 点击提现
  showWithrawal = () => {
    this.setState({ showWithdrawalPopup: true });
  }

  // 提现到微信钱包
  moneyToWixin = (moneyNum) => {
    console.log('钱数', moneyNum);
    this.setState({ showWithdrawalPopup: false });
  }

  render() {
    console.log(this.props.walletData);
    const recordType = {
      income: '收入明细',
      pay: '支出明细',
      withdrawal: '提现记录',
    };
    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <Header></Header>
        </div>
        <div className={layout.body}>
          {/* 左边内容 */}
          <div className={layout.bodyLeft}>
            <div className={layout.header}>
              {
                this.state.type === 'income' ? <Icon name='EditOutlined' size='18' color='#3ac15f'></Icon> : ''
              }
              {
                this.state.type === 'pay' ? <Icon name='EditOutlined' size='18' color='#2469f6'></Icon> : ''
              }
              {
                this.state.type === 'withdrawal' ? <Icon name='EditOutlined' size='18' color='#e02433'></Icon> : ''
              }
              <div className={layout.title}>{recordType[this.state.type]}</div>
            </div>
            <div className={layout.choice}>
              <div className={layout.choiceLeft}>
                <div className={layout.choiceType}>2020年10月</div>
                <div className={layout.choiceType}>全部类型</div>
              </div>
              <div className={layout.recordNumber}>共有{16}条记录</div>
            </div>
            <div className={layout.recordList}>
              <RecordList data={this.state.recordData} type={this.state.type}></RecordList>
              <NoMore></NoMore>
            </div>
          </div>

          {/* 右边信息 */}
          <div className={layout.bodyRigth}>
            <div className={layout.walletInfo}>
              <WalletInfo
                walletData={this.props.walletData}
                webPageType='PC'
                showWithrawal={() => this.showWithrawal()}
              >
              </WalletInfo>
            </div>
            <div className={layout.tabs}>
              <Tabs selectClick={type => this.selectClick(type)}></Tabs>
            </div>
            <div className={layout.copyright}>
              <Copyright></Copyright>
            </div>
          </div>
        </div>

        {/* 提现弹框 */}
        <WithdrawalPop
          visible={this.state.showWithdrawalPopup}
          onClose={() => this.setState({ showWithdrawalPopup: false })}
          moneyNumber={this.props.walletData?.availableAmount}
          moneyToWixin={moneyNum => this.moneyToWixin(moneyNum)}
        />
      </div>
    );
  }
}

export default withRouter(ThreadPCPage);
