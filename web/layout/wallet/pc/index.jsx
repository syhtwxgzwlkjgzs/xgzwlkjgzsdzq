import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import Header from '@components/header';
import Copyright from '@components/copyright';
import { Dropdown, Icon } from '@discuzq/design';
import WalletInfo from './components/wallet-info/index';
import RecordList from './components/record-list/index';
import NoMore from './components/no-more';
import Tabs from './components/tabs';
import WithdrawalPop from './components/withdrawal-popup';
import layout from './layout.module.scss';
import { INCOME_DETAIL_CONSTANTS, EXPAND_DETAIL_CONSTANTS, CASH_DETAIL_CONSTANTS } from '@common/constants/wallet';
import { typeFilter } from './adapter';
import { formatDate } from '@common/utils/format-date.js';

@inject('site')
@inject('wallet')
@observer
class ThreadPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordData: [],
      type: 'income',
      showWithdrawalPopup: false, // 提现弹框是否显示
      page: 1,
      totalPage: 1,
      selectType: 'all', // 筛选类型
    };
  }

  async componentDidMount() {
    const { getUserWalletInfo } = this.props.wallet;
    // 获取钱包信息
    await getUserWalletInfo();
    await this.initStateAndFetch()
  }

  initStateAndFetch = () => {
    this.setState(
      {
        page: 1,
        totalPage: 1,
      },
      () => {
        switch (this.state.type) {
          case 'income':
            this.fetchIncomeDetail();
            break;
          case 'pay':
            this.fetchExpendDetail();
            break;
          case 'withdrawal':
            this.fetchCashDetail();
            break;
        }
      },
    );
  };

  fetchIncomeDetail = async () => {
    try {
      const detailRes = await this.props.wallet.getInconmeDetail({
        page: this.state.page,
        type: this.state.selectType,
        date: this.state.consumptionTime,
      });
      const pageState = {
        totalPage: detailRes.totalPage,
      };
      if (this.state.page <= pageState.totalPage) {
        Object.assign(pageState, {
          page: this.state.page + 1,
        });
      }
      this.setState(pageState);
    } catch (e) {
      console.error(e);
      if (e.Code) {
        Toast.error({
          content: e.Msg,
          duration: 1000,
        });
      }
    }
  };

  fetchExpendDetail = async () => {
    const detailRes = await this.props.wallet.getExpendDetail({
      page: this.state.page,
      type: this.state.selectType,
      date: this.state.consumptionTime,
    });
    const pageState = {
      totalPage: detailRes.totalPage,
    };
    if (this.state.page <= pageState.totalPage) {
      Object.assign(pageState, {
        page: this.state.page + 1,
      });
    }
    this.setState(pageState);
  };

  fetchCashDetail = async () => {
    const detailRes = await this.props.wallet.getCashLog({
      page: this.state.page,
      type: this.state.selectType,
      date: this.state.consumptionTime,
    });
    const pageState = {
      totalPage: detailRes.totalPage,
    };
    if (this.state.page <= pageState.totalPage) {
      Object.assign(pageState, {
        page: this.state.page + 1,
      });
    }
    this.setState(pageState);
  };

  // 切换选项卡
  selectClick = (val) => {
    console.log(val);
    this.setState({
      type: val,
    });
    this.initSelectType(() => {
      this.initStateAndFetch();
    });
  };

  initSelectType = (callback) => {
    this.setState(
      {
        selectType: 'all',
      },
      callback,
    );
  };

  // 点击提现
  showWithrawal = () => {
    this.setState({ showWithdrawalPopup: true });
  }

  // 提现到微信钱包
  moneyToWixin = (moneyNum) => {
    console.log('钱数', moneyNum);
    this.setState({ showWithdrawalPopup: false });
  }

  listRenderDataFilter = (data) => {
    const targetTypeData = typeFilter(data, this.state.selectType);
    const targetDateData = typeFilter(targetTypeData, formatDate(this.state.consumptionTime, 'yyyy-MM'));
    if (Object.keys(targetDateData).length === 0) return [];
    return Object.values(targetDateData).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

  // 获取recordData
  getRecordData = () => {
    const { incomeDetail = {}, expandDetail = {}, cashDetail = {} } = this.props.wallet;
    const incomeData = this.listRenderDataFilter(incomeDetail) || []
    const expandData = this.listRenderDataFilter(expandDetail) || []
    const cashData = this.listRenderDataFilter(cashDetail) || []
    if (this.state.type === 'income') { // 收入
      return incomeData
    } else if (this.state.type === 'pay') {
      return expandData
    } else if (this.state.type === 'withdrawal') {
      return cashData
    }
  }

  // 点击冻结金额
  onFrozenAmountClick = () => {

  }

  // 点击菜单 选择不同类型
  handleChangeSelectedType = (value) => {
    this.setState({
      selectType: value
    })
  }

  renderDropdownMenu = () => {
    const data = this.renderSelectContent()
    return (
      <Dropdown.Menu defaultKey={['all']}>
        {
          data.map(item => {
            return <Dropdown.Item id={item.id} >{item.title}</Dropdown.Item>
          })
        }
      </Dropdown.Menu>
    )
  }

  // 根据当前选项渲染下拉选择器内容
  renderSelectContent = () => {
    const defaultType = {
      id: 'all',
    };

    let dataSource = {};
    switch (this.state.type) {
      case 'income':
        dataSource = INCOME_DETAIL_CONSTANTS;
        defaultType.title = '全部类型';
        break;
      case 'pay':
        dataSource = EXPAND_DETAIL_CONSTANTS;
        defaultType.title = '全部类型';
        break;
      case 'withdrawal':
        dataSource = CASH_DETAIL_CONSTANTS;
        defaultType.title = '全部状态';
    }

    const dataSourceArray = Object.values(dataSource).map(item => ({ title: item.text, id: item.code }));

    dataSourceArray.unshift(defaultType);

    return dataSourceArray;
  };

  // 点击切换tag的显示
  renderSelectedType = () => {
    if (this.state.selectType === 'all') {
      if (this.state.type === 'withdrawal') {
        return '全部状态';
      }
      return '全部类型';
    }
    let arr = {};
    switch (this.state.type) {
      case 'income':
        arr = INCOME_DETAIL_CONSTANTS;
        break;
      case 'pay':
        arr = EXPAND_DETAIL_CONSTANTS;
        break;
      case 'withdrawal':
        arr = CASH_DETAIL_CONSTANTS;
    }
    for (const key in arr) {
      if (arr[key].code === this.state.selectType) {
        return arr[key].text || '';
      }
    }
  }

  render() {
    const recordType = {
      income: '收入明细',
      pay: '支出明细',
      withdrawal: '提现记录',
    };
    const { walletInfo } = this.props.wallet;
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
                this.state.type === 'income' ? <Icon name='TicklerOutlined' size='18' color='#3ac15f'></Icon> : ''
              }
              {
                this.state.type === 'pay' ? <Icon name='WallOutlined' size='18' color='#2469f6'></Icon> : ''
              }
              {
                this.state.type === 'withdrawal' ? <Icon name='TransferOutOutlined' size='18' color='#e02433'></Icon> : ''
              }
              <div className={layout.title}>{recordType[this.state.type]}</div>
            </div>
            <div className={layout.choice}>
              <div className={layout.choiceLeft}>
                <div className={layout.choiceType}>2020年10月</div>
                <div className={layout.choiceType}>
                  <Dropdown onChange={this.handleChangeSelectedType} placement="right" trigger="click" menu={this.renderDropdownMenu()} >
                    <div>
                      {this.renderSelectedType()}
                    </div>
                  </Dropdown>
                </div>
              </div>
              <div className={layout.recordNumber}>共有{16}条记录</div>
            </div>
            <div className={layout.recordList}>
              <RecordList data={this.getRecordData()} type={this.state.type}></RecordList>
              {/* <NoMore></NoMore> */}
            </div>
          </div>

          {/* 右边信息 */}
          <div className={layout.bodyRigth}>
            <div className={layout.walletInfo}>
              <WalletInfo
                walletData={walletInfo}
                webPageType='PC'
                showWithrawal={() => this.showWithrawal()}
                onFrozenAmountClick={this.onFrozenAmountClick}
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
