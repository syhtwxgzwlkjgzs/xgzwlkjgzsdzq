import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Icon, Radio,Button } from '@discuzq/design';
import isWeixin from '@common/utils/is-weixin';
import { View, Text } from '@tarojs/components';
import { PAY_MENT_MAP, PAYWAY_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants.js';
import { listenWXJsBridgeAndExecCallback, onBridgeReady } from '../../../../../common/store/pay/weixin-miniprogram-backend.js'
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
      paymentType: 'wallet'
    })
    this.props.payBox.payWay = PAYWAY_MAP.WALLET
    this.props.payBox.password = null
  }

  async componentDidMount() {
    const { id } = this.props?.user;
    try {
      this.initState()
      await this.props.payBox.getWalletInfo(id);
    } catch (error) { }
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
    // this.props.payBox.visible = false;
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
      // 表示钱包支付
      try {
        await this.props.payBox.walletPayEnsure();
      } catch (error) {

      }
    } else if (this.props.payBox.payWay === PAYWAY_MAP.WX) {
      // 表示微信支付
      if (!isWeixin()) {
        await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode: PAY_MENT_MAP.WX_H5 });
        return;
      }
      await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode });
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
    const { payConfig } = this.state;
    const { user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay } = userInfo || {};
    let disabled = !this.props.payBox.payWay
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET && !canWalletPay) {
      disabled = true
    }
    return (
      <View className={styles.payBox}>
        <View className={styles.title}>
          <Text>支付金额：￥{options.amount}</Text>
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
                    {(item.paymentType === PAYWAY_MAP.WX || canWalletPay) && <Radio name={item.paymentType} />}
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
          <Button full disabled={disabled} className={styles.btn} onClick={this.handlePayConfirmed}>确认支付￥{options.amount}元</Button>
          <Button full onClick={this.handleCancel} className={styles.btn}>取消</Button>
        </View>
      </View>
    );
  }
}
