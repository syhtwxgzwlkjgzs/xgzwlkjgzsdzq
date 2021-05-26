import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Button, Radio, Toast, Spin } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import { PAY_MENT_MAP, PAYWAY_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';
import isWeixin from '@common/utils/is-weixin';
import {
  listenWXJsBridgeAndExecCallback,
  onBridgeReady,
  wxValidator,
  mode,
} from '../../../../../common/store/pay/weixin-h5-backend';
import throttle from '@common/utils/thottle.js';

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
      paymentType: null,
    };
    this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  initState = () => {
    this.setState({
      paymentType: null,
    });
    this.props.payBox.payWay = null;
  };

  async componentDidMount() {
    const { id } = this.props?.user;
    try {
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
        <p className={styles.subText} onClick={this.goSetPayPwa}>
          请设置支付密码
        </p>
      );
    }
    if (Number(this.props.payBox?.walletAvaAmount) < Number(amount)) {
      return <p className={styles.subText}>余额不足</p>;
    }
    return (
      <>
        {
          this.props.payBox?.walletAvaAmount ? (
            <p className={styles.subText}>钱包余额：￥{this.props.payBox?.walletAvaAmount}</p>
          ) : (
            <Spin type="spinner" size={14}></Spin>
          )
        }
      </>
    )

  }

  goSetPayPwa() {
    Router.push({ url: `/my/edit/paypwd?type=paybox` });
    this.props.payBox.visible = false;
  }

  /**
   * 选择支付方式
   */
  handleChangePaymentType = (value) => {
    this.props.payBox.payWay = value;
  };

  // 点击确认支付
  handlePayConfirmed = throttle(async () => {
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
      // FIXME: 增加兜底处理
      // 表示微信支付
      try {
        if (!isWeixin()) {
          await this.props.payBox.wechatPayOrder({
            listenWXJsBridgeAndExecCallback,
            onBridgeReady,
            wxValidator,
            mode: PAY_MENT_MAP.WX_H5,
          });
          return;
        }
        await this.props.payBox.wechatPayOrder({ listenWXJsBridgeAndExecCallback, onBridgeReady, wxValidator, mode });
      } catch (e) {
        console.error(e);
        Toast.error({
          content: '拉起微信支付失败',
          duration: 1000,
        });
      }
      // this.props.payBox.visible = false
    }
  }, 500);

  // 点击取消
  handleCancel = () => {
    // 回到上一步
    this.props.payBox.step = STEP_MAP.SURE;
    this.props.payBox.payWay = null;
  };

  // 转换金额小数
  transMoneyToFixed = (num) => {
    return Number(num).toFixed(2);
  };

  render() {
    const { options = {} } = this.props.payBox;
    const { payConfig, paymentType } = this.state;
    const canWalletPay = this.props.user?.canWalletPay;
    let disabled = !this.props.payBox.payWay;
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET && !canWalletPay) {
      disabled = true;
    }
    return (
      <div className={styles.payBox}>
        <div className={styles.title}>
          <p>
            <span className={styles.moneyUnit}>￥ </span>
            {this.transMoneyToFixed(options.amount)}
          </p>
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
                    {(item.paymentType === PAYWAY_MAP.WX ||
                      (canWalletPay && Number(this.props.payBox?.walletAvaAmount) >= Number(options.amount))) && (
                        <Radio name={item.paymentType} />
                      )}
                  </div>
                </div>
              );
            })}
          </Radio.Group>
        </div>
        <div className={styles.btnBox}>
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
        </div>
        {/* 关闭按钮 */}
        <div className={styles.payBoxCloseIcon} onClick={this.handleCancel}>
          <Icon name="CloseOutlined" size={14} />
        </div>
      </div>
    );
  }
}
