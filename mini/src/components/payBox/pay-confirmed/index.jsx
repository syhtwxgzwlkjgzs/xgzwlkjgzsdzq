import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Radio } from '@discuzq/design';
// import browser from '@common/utils/browser';
// import Router from '@common/utils/web-router';
import { Button, View, Text, Checkbox } from '@tarojs/components';
import { PAY_MENT_MAP, PAYWAY_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants.js';
import { listenWXJsBridgeAndExecCallback, onBridgeReady } from '../../../../../common/store/pay/weixin-miniprogram-backend.js'
@inject('site')
@inject('user')
@inject('payBox')
@observer
export default class PayBox extends React.Component {
  constructor(props) {
    super(props);
    const { site } = props;

    const payConfig = [
      {
        name: '钱包支付',
        icon: 'PayOutlined',
        color: '#1878f3',
        paymentType: 20,
      },
    ];

    payConfig.unshift({
      name: '微信支付',
      icon: 'PayOutlined',
      color: '#09bb07',
      paymentType: 13,
    });

    this.state = {
      payConfig,
      paymentType:20
    };
    this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props?.user;
    try {
      await this.props.payBox.getWalletInfo(id);
    } catch (error) {}
  }

  walletPaySubText() {
    const { user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay } = userInfo || {};
    if (!canWalletPay) {
      return (
        <Text className={styles.subText} onClick={this.goSetPayPwa}>
          请设置支付密码
        </Text>
      );
    }
    return <Text className={styles.subText}>钱包余额：￥{this.props.payBox?.walletAvaAmount}</Text>;
  }

  goSetPayPwa() {
    this.props.payBox.step = STEP_MAP.SET_PASSWORD;
    this.props.payBox.visible = false;
  }

  /**
   * 选择支付方式
   */
  handleChangePaymentType = (value) => {
    console.log(value,'sssssss_');
    this.setState(
      {
        paymentType: value,
      },
      () => {
        if (value === PAY_MENT_MAP.WALLET) {
          this.props.payBox.payWay = PAYWAY_MAP.WALLET;
        } else if (value === PAY_MENT_MAP.WX_MINI_PROGRAM) {
          this.props.payBox.payWay = PAYWAY_MAP.WX;
        }
      },
    );
  };

  // 点击确认支付
  handlePayConfirmed = async () => {
    if (this.state.paymentType === PAY_MENT_MAP.WALLET) {
      // 表示钱包支付
      await this.props.payBox.walletPayEnsure();
      this.props.payBox.visible = false;
      // this.goSetPayPwa()
    } else if (this.state.paymentType === PAY_MENT_MAP.WX_MINI_PROGRAM) {
      // 表示微信支付
      console.log('进来了', 'sssssss_点击微信支付');
      await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady });
      // this.props.payBox.visible = false
    }
  };
  /**
   * 选择支付方式
   */
  handleChangePaymentType = (value) => {
    this.setState(
      {
        paymentType: value,
      },
      () => {
        if (value === PAY_MENT_MAP.WALLET) {
          this.props.payBox.payWay = PAYWAY_MAP.WALLET;
        } else if (value === PAY_MENT_MAP.WX_MINI_PROGRAM) {
          this.props.payBox.payWay = PAYWAY_MAP.WX;
        }
      },
    );
  };

  // 点击确认支付
  handlePayConfirmed = async () => {
    console.log(this.state.paymentType);
    if (this.state.paymentType === PAY_MENT_MAP.WALLET) {
      // 表示钱包支付
      await this.props.payBox.walletPayEnsure();
      this.props.payBox.visible = false;
      // this.goSetPayPwa()
    } else if (this.state.paymentType === PAY_MENT_MAP.WX_MINI_PROGRAM) {
      // 表示微信支付
      console.log('进来了', 'sssssss_点击微信支付');
      await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady });
      // this.props.payBox.visible = false
    }
  };

  render() {
    const { options = {} } = this.props.payBox;
    const { payConfig, paymentType, checked } = this.state;
    return (
        <View className={styles.payBox}>
          <View className={styles.title}>
            <Text>支付金额：￥{options.amount}</Text>
          </View>
          <View className={styles.list}>
            <Radio.Group
              value={paymentType}
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
                      {item.paymentType === PAY_MENT_MAP.WALLET && this.walletPaySubText()}
                      <Radio name={item.paymentType}/>
                    </View>
                  </View>
                );
              })}
            </Radio.Group>
          </View>
          {/* <View className={styles.tips}>
            <Text>asdadsadsd</Text>
          </View> */}
          <View className={styles.btnBox}>
            <Button className={styles.btn} onClick={this.handlePayConfirmed}>确认支付￥{options.amount}元</Button>
            <Button className={styles.btn}>取消</Button>
          </View>
        </View>
    );
  }
}
