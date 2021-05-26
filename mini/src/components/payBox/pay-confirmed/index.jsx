import React from 'react';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import { inject, observer } from 'mobx-react';
import { Icon, Radio, Button, Spin, Toast } from '@discuzq/design';
import { View, Text } from '@tarojs/components';
import { PAY_MENT_MAP, PAYWAY_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants.js';
import { listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode } from '../../../../../common/store/pay/weixin-miniprogram-backend.js';
@inject('user')
@inject('payBox')
@observer
export default class PayBox extends React.Component {
  constructor(props) {
    super(props);
    const payConfig = [
      {
        name: '钱包支付',
        icon: 'PurseOutlined',
        color: '#1878f3',
        paymentType: 'wallet',
      },
    ];
    payConfig.unshift({
      name: '微信支付',
      icon: 'WechatPaymentOutlined',
      color: '#09bb07',
      paymentType: 'weixin',
    });

    this.state = {
      payConfig,
      paymentType: null
    };
    this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  initState = () => {
    this.setState({
      paymentType: null
    })
    this.props.payBox.payWay = PAYWAY_MAP.WALLET
    this.props.payBox.password = null
  }

  // 转换金额小数
  transMoneyToFixed = (num) => {
    return Number(num).toFixed(2);
  };

  async componentDidMount() {
    const { id } = this.props?.user;
    try {
      this.initState()
      await this.props.payBox.getWalletInfo(id);
    } catch (error) {
      Toast.error({
        content: '获取用户钱包信息失败',
        duration: 1000,
      });
    }
  }

  walletPaySubText() {
    const canWalletPay = this.props.user?.canWalletPay;
    const { options = {} } = this.props.payBox;
    const { amount = 0 } = options;
    if (!canWalletPay) {
      return (
        <Text className={styles.subText} onClick={this.goSetPayPwa}>
          请设置支付密码
        </Text>
      );
    }
    if (Number(this.props.payBox?.walletAvaAmount) < Number(amount)) {
      return <Text className={styles.subText}>余额不足</Text>;
    }
    return (
      <>
        {
          this.props.payBox?.walletAvaAmount ? (
            <Text className={styles.subText}>钱包余额：￥{this.props.payBox?.walletAvaAmount}</Text>
          ) : (
            <Spin type="spinner" size={14}></Spin>
          )
        }
      </>
    )

  }

  goSetPayPwa() {
    Taro.navigateTo({ url: `/subPages/my/edit/paypwd/index?type=paybox` });
    this.props.payBox.visible = false;
  }

  /**
   * 选择支付方式
   */
  handleChangePaymentType = (value) => {
    this.props.payBox.payWay = value
  };

  // 点击确认支付
  handlePayConfirmed = async () => {
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET) {
      const { options = {} } = this.props.payBox;
      const { amount = 0 } = options;
      if (this.props.payBox?.walletAvaAmount < amount) {
        Toast.error({
          content: '钱包余额不足',
          duration: 1000,
        });
        return;
      }
      // 表示钱包支付
      this.props.payBox.walletPayEnsure();
    } else if (this.props.payBox.payWay === PAYWAY_MAP.WX) {
      try {
        await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode });
      } catch (error) {
        console.error(e);
        Toast.error({
          content: '拉起微信支付失败',
          duration: 1000,
        });
      }
    }
  };

  // 点击取消
  handleCancel = () => {
    // 回到上一步
    this.props.payBox.step = STEP_MAP.SURE
    this.props.payBox.payWay = null
  }

  render() {
    const { options = {} } = this.props.payBox;
    const { payConfig, paymentType } = this.state;
    const canWalletPay = this.props.user?.canWalletPay;
    let disabled = !this.props.payBox.payWay;
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET && !canWalletPay) {
      disabled = true;
    }
    return (
      <View className={styles.payBox}>
        <View className={styles.title}>
          <Text>
            <Text className={styles.moneyUnit}>￥ </Text>
            {this.transMoneyToFixed(options.amount)}
          </Text>
        </View>
        <View className={styles.list}>
          <Radio.Group
            value={this.props.payBox.payWay}
            onChange={(checked) => {
              this.handleChangePaymentType(checked);
            }}
          >
            {payConfig.map((item, key) => {
              return (
                <View key={key} className={styles.listItem}>
                  <View className={styles.left}>
                    <Icon className={styles.icon} name={item.icon} color={item.color} size={20} />
                    <Text className={styles.text}>{item.name}</Text>
                  </View>
                  <View className={styles.right}>
                    {item.paymentType === PAYWAY_MAP.WALLET && this.walletPaySubText()}
                    {(item.paymentType === PAYWAY_MAP.WX || (canWalletPay && Number(this.props.payBox?.walletAvaAmount) >= Number(options.amount))) && <Radio name={item.paymentType} />}
                  </View>
                </View>
              );
            })}
          </Radio.Group>
        </View>
        <View className={styles.btnBox}>
          <Button
            disabled={disabled}
            className={styles.btn}
            type="primary"
            size="large"
            full
            onClick={this.handlePayConfirmed}
          >
            确认支付
          </Button>
        </View>
        {/* 关闭按钮 */}
        <View className={styles.payBoxCloseIcon} onClick={this.handleCancel}>
          <Icon name="CloseOutlined" size={12} />
        </View>
      </View>
    );
  }
}
