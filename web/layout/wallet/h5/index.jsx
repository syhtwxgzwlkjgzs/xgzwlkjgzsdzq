import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Tabs, Icon, Button, Toast } from '@discuzq/design';
import WalletInfo from './components/wallet-info/index';
import IncomeList from './components/income-list/index';
import PayList from './components/pay-list/index';
import WithdrawalList from './components/withdrawal-list/index';
import NoMore from './components/no-more';
import classNames from 'classnames';
import FilterView from './components/all-state-popup';
import DatePickers from '@components/thread/date-picker';
import { formatDate } from '@common/utils/format-date.js';

import layout from './layout.module.scss';


@inject('wallet')
@observer
class WalletH5Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabsType: 'income',
      visibleshow: false,
      consumptionTimeshow: false,
      consumptionTime: '',
    };
  }
  async componentDidMount() {
    const { getUserWalletInfo } = this.props.wallet
    getUserWalletInfo()
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
      this.setState({ consumptionTimeshow: true })
    } else {
      console.log('点击了全部状态');
      this.setState({ visibleshow: true })
    }
  }
  // 关闭全部状态的弹框
  handleStateCancel = () => {
    this.setState({ visibleshow: false });
  }
  // 点击确定后对时间选择的弹框的操作
  handleMoneyTimeCancel = (time) => {
    const gapTime = new Date(time).getTime() - new Date().getTime();
    if (gapTime < 0) {
      this.setState({ consumptionTime: formatDate(time, 'yyyy年MM月') });
      this.setState({ consumptionTimeshow: false });
    } else {
      Toast.warning({ content: '时间要小于当前时间' });
      return;
    }

  }
  render() {
    const tabList = [
      ['income', <div className={layout.tagbox}>
        <Icon
          name='TicklerOutlined'
          className={classNames(layout.tag, {
            [layout['tag-active-green']]: this.state.tabsType != 'income'
          })}
        />
        收入明细
        </div>, null, { name: 'TicklerOutlined' }],
      ['pay', <div className={layout.tagbox}>
        <Icon
          name='WallOutlined'
          className={classNames(layout.tag, {
            [layout['tag-active-blue']]: this.state.tabsType != 'pay'
          })}
        />
        支出明细
        </div>, null, { name: 'WallOutlined' }],
      ['withdrawal', <div className={layout.tagbox}>
        <Icon
          name='TransferOutOutlined'
          className={classNames(layout.tag, {
            [layout['tag-active-red']]: this.state.tabsType != 'withdrawal'
          })}
        />
        提现记录
     </div>, null, { name: 'TransferOutOutlined' }],
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

    const data = [
      { title: '所有', id: 1 },
      { title: '视频', id: 2 },
      { title: '图片', id: 3 },
      { title: '语音', id: 4 },
      { title: '商品', id: 5 },
      { title: '红包', id: 6 },
      { title: '悬赏', id: 7 },
      { title: '悬赏问答', id: 8 },
    ];

    const { walletInfo, incomeDetail, expandDetail, freezeDetail, cashDetail } = this.props.wallet

    return (
      <div className={layout.container}>
        <div className={layout.scroll}>
          <div className={layout.header}>
            <WalletInfo
              walletData={walletInfo}
              webPageType='h5'
              onFrozenAmountClick={() => this.onFrozenAmountClick()}
            >
            </WalletInfo>
          </div>
          <div className={layout.choiceTime}>
            <div className={layout.status} onClick={() => this.onSelectStatus('all')}>
              <span className={layout.text}>{this.state.tabsType === 'withdrawal' ? '全部状态' : '全部类型'}</span>
              <Icon name='UnderOutlined' size='6' className={layout.icon}></Icon>
            </div>
            <div className={layout.status} onClick={() => this.onSelectStatus('select')}>
              <span className={layout.text}>{this.state.consumptionTime || formatDate(new Date(), 'yyyy年MM月')}</span>
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
        <FilterView
          data={data}
          visible={this.state.visibleshow}
          handleCancel={() => { this.handleStateCancel() }}
          handleSubmit={(id) => { console.log(id); }}
        />
        <DatePickers
          isOpen={this.state.consumptionTimeshow}
          onCancels={() => { this.setState({ consumptionTimeshow: !this.state.consumptionTimeshow }) }}
          onSelects={(time) => { this.handleMoneyTimeCancel(time) }}
          dateConfig={{
            year: {
              format: 'YYYY',
              caption: 'Year',
              step: 1,
            },
            month: {
              format: 'MM',
              caption: 'Mon',
              step: 1,
            }
          }}
        />
      </div>
    );
  }
}

export default withRouter(WalletH5Page);
