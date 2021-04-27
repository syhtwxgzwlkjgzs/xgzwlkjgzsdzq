import React, { Component } from 'react';
import styles from './index.module.scss';
import { Dialog, Button, Checkbox, Icon, Input, Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { PAYWAY_MAP, STEP_MAP, PAY_MENT_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('user')
@inject('payBox')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelectedKey: 'wallet',
    };
  }

  async componentDidMount() {
    try {
      this.changePayment();
      // 获取微信二维码
      await this.props.payBox.wechatPayOrderQRCode();
      // 获取钱包用户信息
      const { id } = this.props?.user;
      if (!id) return;
      await this.props.payBox.getWalletInfo(id);
    } catch (error) {}
  }

  onCloseBtn = () => {
    this.setState({
      isShow: false,
    });
  };

  changePayment = (type = PAYWAY_MAP.WALLET) => {
    this.setState(
      {
        isSelectedKey: type,
      },
      () => {
        this.handleChangePaymentType(type);
      },
    );
  };

  onPasswordChange = (e) => {
    console.log(e.target.value);
    if (isNaN(e.target.value)) return;
    this.props.payBox.password = e.target.value;
  };

  goSetPayPwa = () => {
    // Router.redirect({url: '/test/payoffpwd?title=设置支付密码'});
    // Router.push('/test/payoffpwd?title=设置支付密码');
    this.props.payBox.step = STEP_MAP.SET_PASSWORD;
    // this.props.payBox.visible = false;
  };

  /**
   * 选择支付方式
   */
  handleChangePaymentType = (type) => {
    let value = type === PAYWAY_MAP.WX ? 10 : 20;
    this.setState(
      {
        paymentType: value,
      },
      () => {
        if (value === PAY_MENT_MAP.WALLET) {
          this.props.payBox.payWay = PAYWAY_MAP.WALLET;
        } else if (value === PAY_MENT_MAP.WX_QRCODE) {
          this.props.payBox.payWay = PAYWAY_MAP.WX;
        }
      },
    );
  };

  // 点击确认支付
  handlePayConfirmed = async () => {
    if (this.state.paymentType === PAY_MENT_MAP.WALLET) {
      // 表示钱包支付
      // await this.props.payBox.walletPayEnsure();
      if (!this.props.payBox.password) {
        Toast.error({
          content: '请输入支付密码',
        });
        return;
      }
      await this.props.payBox.walletPayOrder();
      Toast.success({
        content: '支付成功',
        hasMask: false,
        duration: 1000,
      });
      await this.props.payBox.clear();
    } else if (this.state.paymentType === PAY_MENT_MAP.WX_QRCODE) {
      // 表示微信支付
      console.log('进来了', 'sssssss_点击微信支付');
      await this.props.payBox.wechatPayOrderQRCode();
      // this.props.payBox.visible = false
    }
  };

  renderDiffPaymementContent = () => {
    const { isSelectedKey } = this.state;
    if (isSelectedKey === PAYWAY_MAP.WX) {
      return this.renderWechatCodePaymementContent();
    }
    if (isSelectedKey === PAYWAY_MAP.WALLET) {
      return this.renderWalletPaymementContent();
    }
  };

  // 渲染微信支付内容
  renderWechatCodePaymementContent = () => (
    <div className={styles.wechatPayment}>
      {/* 二维码 */}
      <div className={styles.wPaymentCode}>
        <img src={this.props.payBox.wechatQRCode} />
      </div>
      {/* 微信支付内容 */}
      <div className={styles.wPaymentDec}>
        <div className={styles.wPayment_01}>
          <Icon className={styles.icon} name={'PayOutlined'} color={'#09bb07'} size={30} />
          微信支付
        </div>
        <div className={styles.wPayment_02}>
          <Icon className={styles.icon} name={'PayOutlined'} color={'#09bb07'} size={30} />
          <div>
            <p>打开手机微信扫一扫</p>
            <p>扫描二维码完成支付</p>
          </div>
        </div>
        <div className={styles.wPayment_03}>
          <p>二维码有效时长为5分钟，请尽快支付</p>
        </div>
      </div>
    </div>
  );

  // 渲染钱包支付内容
  renderWalletPaymementContent = () => {
    const { user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay } = userInfo || {};
    return (
      <div className={styles.walletPayment}>
        <div className={styles.walletTitle}>
          <Icon className={styles.icon} name="PayOutlined" size="30" color={'#1878f3'} />
          钱包支付
        </div>
        {!canWalletPay ? (
          <>
            <div className={styles.walletDec}>
              <span>支付密码</span>
              <span>
                钱包支付，需{' '}
                <span onClick={this.goSetPayPwa} className={styles.walletSettingPwd}>
                  设置支付密码
                </span>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.walletDec}>
              <span>钱包余额</span>
              <span className={styles.walletBalance}>￥{this.props.payBox?.walletAvaAmount}</span>
            </div>
            <div className={styles.walletDec}>
              <span>支付密码</span>
              <Input
                mode="password"
                className={styles.walletChangePwd}
                placeholder="请输入密码"
                value={this.props.payBox.password}
                onChange={this.onPasswordChange}
              />
              <Button
                onClick={this.handlePayConfirmed}
                size="large"
                className={styles.walletConfirmBtn}
                type="primary"
                disabled={!this.props?.payBox?.password}
              >
                确认支付
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  render() {
    const { isSelectedKey } = this.state;
    const { options = {} } = this.props?.payBox;
    const { amount } = options;
    return (
      <div>
        <div className={styles.payconfirmWrapper}>
          {/* 头部 */}
          <div className={styles.payTitle}>支付</div>
          {/* 支付金额显示 */}
          <div className={styles.payMoney}>支付金额 ￥{amount}</div>
          {/* tab切换支付方式 */}
          <div>
            <div className={styles.payTab_top}>
              <a
                onClick={() => {
                  this.changePayment('weixin');
                }}
                className={`${styles.payTab} ${isSelectedKey === PAYWAY_MAP.WX && styles.payTabActive}`}
              >
                微信支付
              </a>
              <a
                onClick={() => {
                  this.changePayment('wallet');
                }}
                className={`${styles.payTab} ${isSelectedKey === PAYWAY_MAP.WALLET && styles.payTabActive}`}
              >
                钱包支付
              </a>
            </div>
            <hr />
            {/* 渲染不同方式的支付内容 */}
            <div className={styles.payTab_bottom}>{this.renderDiffPaymementContent()}</div>
          </div>
          {/* 关闭按钮 */}
          <div
            onClick={() => {
              this.props.payBox.clear();
            }}
            className={styles.paymentCloseBtn}
          >
            X
          </div>
        </div>
      </div>
    );
  }
}
