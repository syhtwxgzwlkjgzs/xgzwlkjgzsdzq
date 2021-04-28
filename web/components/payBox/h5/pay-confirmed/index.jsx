import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Button, Radio } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import { PAY_MENT_MAP, PAYWAY_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';
import isWeixin from '@common/utils/is-weixin';
import {
  listenWXJsBridgeAndExecCallback,
  onBridgeReady,
  wxValidator,
  mode,
} from '../../../../../common/store/pay/weixin-h5-backend';
// import browser from '@common/utils/browser';

@inject('user')
@inject('payBox')
@observer
export default class PayBox extends React.Component {
  constructor(props) {
    super(props);
    const payConfig = [
      {
        name: '钱包支付',
        icon: 'PayOutlined',
        color: '#1878f3',
        paymentType: 'wallet',
      },
    ];
    payConfig.unshift({
      name: '微信支付',
      icon: 'PayOutlined',
      color: '#09bb07',
      paymentType: 'weixin',
    });

    this.state = {
      payConfig,
      paymentType: null,
    };
    this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  initState = () => {
    this.setState({
      paymentType: null
    })
    this.props.payBox.payWay = null
  }

  async componentDidMount() {
    const { id } = this.props?.user;
    try {
      await this.props.payBox.getWalletInfo(id);
    } catch (error) { }
  }

  walletPaySubText() {
    const { user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay, walletBalance } = userInfo || {};
    if (!canWalletPay) {
      return (
        <p className={styles.subText} onClick={this.goSetPayPwa}>
          请设置支付密码
        </p>
      );
    }
    return <p className={styles.subText}>钱包余额：￥{this.props.payBox?.walletAvaAmount}</p>;
  }

  goSetPayPwa() {
    // Router.redirect({url: '/test/payoffpwd?title=设置支付密码'});
    // Router.push('/test/payoffpwd?title=设置支付密码');
    this.props.payBox.step = STEP_MAP.SET_PASSWORD;
    // this.props.payBox.visible = false;
  }

  /**
   * 选择支付方式
   */
  handleChangePaymentType = (value) => {
    this.setState(
      {
        paymentType: value,
      },
      () => {
        if (value === PAYWAY_MAP.WALLET) {
          this.props.payBox.payWay = PAYWAY_MAP.WALLET;
        } else if (value === PAYWAY_MAP.WX) {
          this.props.payBox.payWay = PAYWAY_MAP.WX;
        }
      },
    );
  };

  // 点击确认支付
  handlePayConfirmed = async () => {
    if (this.state.paymentType === PAYWAY_MAP.WALLET) {
      // 表示钱包支付
      await this.props.payBox.walletPayEnsure();
      // this.props.payBox.visible = false;
      // this.goSetPayPwa()
    } else if (this.state.paymentType === PAYWAY_MAP.WX) {
      // 表示微信支付
      if (!isWeixin()) {
        await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode: PAY_MENT_MAP.WX_H5 });
        return;
      }
      await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode });
      // this.props.payBox.visible = false
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
    const { user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay, walletBalance } = userInfo || {};
    let disabled = !this.props.payBox.payWay
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET && !canWalletPay) {
      disabled = true
    }
    return (
      <div className={styles.payBox}>
        <div className={styles.title}>
          <p>支付金额：￥{options.amount}</p>
        </div>
        <div className={styles.list}>
          <Radio.Group
            value={this.props?.payBox?.payWay}
            onChange={(checked) => {
              this.handleChangePaymentType(checked);
            }}
          >
            {payConfig.map((item, key) => {
              return (
                <div key={key} className={styles.listItem}>
                  <div className={styles.left}>
                    <Icon className={styles.icon} name={item.icon} color={item.color} size={20} />
                    <p className={styles.text}>{item.name}</p>
                  </div>
                  <div className={styles.right}>
                    {item.paymentType === PAYWAY_MAP.WALLET && this.walletPaySubText()}
                    {(item.paymentType === PAYWAY_MAP.WX || canWalletPay) && <Radio name={item.paymentType} />}
                  </div>
                </div>
              );
            })}
          </Radio.Group>
        </div>
        {/* <div className={styles.tips}>
          <p>asdadsadsd</p>
        </div> */}
        <div className={styles.btnBox}>
          <Button disabled={disabled} className={styles.btn} type="primary" size="large" full onClick={this.handlePayConfirmed}>
            确认支付￥{options.amount} 元
          </Button>
          <Button onClick={this.handleCancel} className={styles.btn} size="large" full>
            取消
          </Button>
        </div>
      </div>
    );
  }
}
