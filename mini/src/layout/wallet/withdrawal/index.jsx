import React from 'react';
import { inject, observer } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import MoneyInput from './components/money-input';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';

@inject('wallet')
@inject('site')
@observer
class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      moneyOverThanAmount: false, // 是否超过当前可提现金额
      withdrawalAmount: 0,
      inputValue: '', // 金额输入内容
    };
  }

  updateState = ({ name, value }) => {
    this.setState({
      [name]: value,
    });
  };

  onChange = (data) => {
    const datas = data.match(/([1-9]\d{0,9}|0)(\.\d{0,2})?/);
    this.setState({
      inputValue: datas ? datas[0] : '',
    });
    this.getmoneyNum(datas ? datas[0] : '');
  };

  initState = () => {
    this.setState({
      visible: true,
      moneyOverThanAmount: false, // 是否超过当前可提现金额
      withdrawalAmount: 0,
      inputValue: '',
    });
  };

  // 获得输入的提现金额
  getmoneyNum = (data) => {
    if (Number(data) >= 1) {
      this.setState({
        withdrawalAmount: data,
      });

      if (Number(this.state.withdrawalAmount) > this.props.walletData.availableAmount) {
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
    if (
      !this.state.withdrawalAmount ||
      parseFloat(this.state.withdrawalAmount) < parseFloat(this.props.site.cashMinSum)
    ) {
      return Toast.warning({ content: '不得小于最低提现金额' });
    }

    this.props.wallet
      .createWalletCash({
        money: this.state.withdrawalAmount,
      })
      .then(async () => {
        Toast.success({
          content: '申请提现成功',
          hasMask: false,
          duration: 2000,
        });
        const { getUserWalletInfo } = this.props.wallet;
        await getUserWalletInfo();
        Taro.navigateBack();
        this.initState();
      })
      .catch((err) => {
        if (err.Code) {
          Toast.error({
            content: err.Msg || '申请提现失败，请重试',
            duration: 2000,
          });
        }
        this.initState();
      });
  };

  render() {
    const { inputValue } = this.state;
    const btnDisabled =
      !inputValue || parseFloat(this.state.withdrawalAmount) > parseFloat(this.props.walletData?.availableAmount);
    return (
      <>
        <View className={styles.container}>
          <View className={styles.main}>
            <View className={styles.totalAmount}>
              <View className={styles.moneyTitle}>可提现金额</View>
              <View className={styles.moneyNum}>{this.props.walletData?.availableAmount}</View>
            </View>
            <View className={styles.moneyInput}>
              <MoneyInput
                // getmoneyNum={data => this.getmoneyNum(data)}
                inputValue={this.state.inputValue}
                onChange={this.onChange}
                updateState={this.updateState}
                visible={this.state.visible}
                minmoney={this.props.site.cashMinSum}
                maxmoney={this.props.walletData?.availableAmount}
              />
            </View>
          </View>
          <View
            className={classNames(styles.footer, {
              [styles.bgBtnColor]: !btnDisabled,
            })}
          >
            <Button type={'primary'} className={styles.button} onClick={this.moneyToWeixin} disabled={btnDisabled}>
              <View className={styles.buttonContent}>
                提现到微信钱包
              </View>
            </Button>
          </View>
        </View>
      </>
    );
  }
}

export default Withdrawal;
