
import React, { useState, Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, Toast } from '@discuzq/design';
import { Icon, Button } from '@discuzq/design';
import styles from './index.module.scss';
import MoneyInput from '../money-input';
@inject('wallet')
@inject('site')
class WithdrawalPop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      moneyOverThanAmount: false, // 是否超过当前可提现金额
      withdrawalAmount: 0,
      inputValue: "", // 金额输入内容
    };
  }

  updateState = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  onChange = (data) => {
    const datas = data.match(/([1-9]\d{0,9}|0)(\.\d{0,2})?/);
    this.setState({
      inputValue: datas ? datas[0] : ''
    })
    this.getmoneyNum(datas ? datas[0] : '');
  };

  initState = () => {
    this.setState({
      visible: true,
      moneyOverThanAmount: false, // 是否超过当前可提现金额
      withdrawalAmount: 0,
      inputValue: "",
    })
    this.props.onClose && this.props.onClose()
  }

  // 获得输入的提现金额
  getmoneyNum = (data) => {
    if (Number(data) >= 1) {
      this.setState({
        withdrawalAmount: data,
      });

      if (Number(this.state?.withdrawalAmount) > this.props.walletData?.availableAmount) {
        this.setState({
          moneyOverThanAmount: true,
        });
      }
    } else {
      this.setState({
        withdrawalAmount: 0,
        moneyOverThanAmount: false,
      });
    }
  };

  // 提现到微信钱包
  moneyToWeixin = async () => {
    if (!this.state.withdrawalAmount || parseFloat(this.state.withdrawalAmount) < parseFloat(this.props.site?.cashMinSum)) {
      return Toast.warning({ content: '不得小于最低提现金额' });
    }

    this.props.wallet.createWalletCash({
      money: this.state.withdrawalAmount,
    }).then(res => {
      Toast.success({
        content: res.Msg || '申请提现成功',
        hasMask: false,
        duration: 1000,
      })
      this.initState();
    }).catch(err => {
      if (err.Code) {
        Toast.error({
          content: err.Msg || "申请提现失败，请重试",
          duration: 1000,
        });
      }
      this.initState();
    });
  };

  render() {
    const { visible: popupVisible, onClose, moneyToWixin } = this.props;
    const walletAvaAmount = this.props.wallet.walletAvaAmount
    const cashMinSum = this.props.site?.cashMinSum
    return (
      <Popup
        position="center"
        visible={popupVisible}
        onClose={onClose}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div></div>
            <div className={styles.title}>提现</div>
            <div onClick={onClose}>
              <Icon name='CloseOutlined' size='12' color='#8590a6'></Icon>
            </div>
          </div>
          <div className={styles.availableAmount}>
            <div className={styles.text}>可提现金额</div>
            <div className={styles.moneyNum}>{walletAvaAmount}</div>
          </div>
          <div className={styles.moneyInput}>
            <MoneyInput
              inputValue={this.state.inputValue}
              onChange={this.onChange}
              updateState={this.updateState}
              visible={this.state.visible}
              minAmount={cashMinSum}
              maxAmount={walletAvaAmount}>
            </MoneyInput>
          </div>
          <div className={styles.button}>
            <Button type='primary' onClick={this.moneyToWeixin}>提现到微信钱包</Button>
          </div>
        </div>
      </Popup>
    )
  }
}


export default WithdrawalPop;
