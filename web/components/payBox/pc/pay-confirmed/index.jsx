import React, { Component } from 'react';
import styles from './index.module.scss';
import { Dialog, Button, Checkbox, Icon, Input, Toast, Radio, Divider } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { PAYWAY_MAP, STEP_MAP, PAY_MENT_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('user')
@inject('payBox')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: 'wallet'
    };
  }

  onClose = () => {
    this.props.payBox.visible = false
    // FIXME: 延时回调的修复
    setTimeout(() => {
      this.props.payBox.clear();
    }, 1000)
  }

  async componentDidMount() {
    try {
      // this.changePayment();
      this.initState()
      // 获取钱包用户信息
      const { id } = this.props?.user;
      if (!id) return;
      await this.props.payBox.getWalletInfo(id);
    } catch (error) {
      console.log(error);
      Toast.error({
        content: '获取用户钱包信息失败',
        duration: 1000,
      });
    }
  }

  initState = () => {
    this.setState({
      paymentType: 'wallet'
    })
    this.props.payBox.payWay = PAYWAY_MAP.WALLET
    this.props.payBox.password = null
  }

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
  handleChangePaymentType = (value) => {
    this.props.payBox.payWay = value

    if (this.props.payBox.payWay === PAYWAY_MAP.WX) {
      this.props.payBox.wechatPayOrderQRCode();
    }
  };

  // 点击确认支付
  handlePayConfirmed = async () => {
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET) {
      // 表示钱包支付
      // await this.props.payBox.walletPayEnsure();
      if (!this.props.payBox.password) {
        Toast.error({
          content: '请输入支付密码',
        });
        return;
      }
      try {
        await this.props.payBox.walletPayOrder();
        Toast.success({
          content: '支付成功',
          hasMask: false,
          duration: 1000,
        });
        await this.props.payBox.clear();
      } catch (error) {
        Toast.error({
          content: '支付失败，请重新输入',
          hasMask: false,
          duration: 1000,
        })
        this.props.payBox.password = null
      }
    }
  };

  renderDiffPaymementContent = () => {
    if (this.props.payBox.payWay === PAYWAY_MAP.WX) {
      return this.renderWechatCodePaymementContent();
    }
    if (this.props.payBox.payWay === PAYWAY_MAP.WALLET) {
      return this.renderWalletPaymementContent();
    }
  };

  // 渲染微信支付内容
  renderWechatCodePaymementContent = () => (
    <div className={styles.wechatPayment}>
      <div style={{ display: 'flex', alignItems: 'center' }}>{/* 二维码 */}
        <div className={styles.wPaymentCode}>
          <img src={this.props.payBox.wechatQRCode} alt="二维码" />
        </div>
        {/* 微信支付内容 */}
        <div className={styles.wPaymentDec}>
          <div className={styles.wPayment_01}>
            <Icon className={styles.icon} name={'WechatPaymentOutlined'} color={'#09bb07'} size={20} />
          微信支付
        </div>
          <div className={styles.wPayment_02}>
            <Icon className={styles.icon} name={'ScanOutlined'} color={'#09bb07'} size={20} />
            <div>
              <p>打开手机微信扫一扫</p>
              <p>扫描二维码完成支付</p>
            </div>
          </div>
        </div></div>
      <div className={styles.wPayment_03}>
        <p>二维码有效时长为5分钟，请尽快支付</p>
      </div>
    </div>
  );

  // 渲染钱包支付内容
  renderWalletPaymementContent = () => {
    const { user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay } = userInfo || {};
    const { options = {} } = this.props.payBox;
    const { amount = 0 } = options;
    return (
      <div className={styles.walletPayment}>
        <div className={styles.walletTitle}>
          <Icon className={styles.icon} name="PurseOutlined" size="20" color={'#1878f3'} />
          钱包支付
        </div>
        {!canWalletPay ? (
          <>
            <div className={styles.walletDec}>
              <span>支付密码</span>
              <span>
                <span className={styles.walletText}>钱包支付，需{' '}</span>
                <span onClick={this.goSetPayPwa} className={styles.walletSettingPwd}>
                  设置支付密码
                </span>
              </span>
            </div>
          </>
        ) : (
          <>
            {
              this.props.payBox?.walletAvaAmount < amount ? (
                <div className={styles.walletDec}>
                  <span>钱包余额</span>
                  <span className={styles.walletBalance}>￥{this.props.payBox?.walletAvaAmount}</span>
                  <span className={styles.walletWarn}>余额不足</span>
                </div>
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
                  </div>
                </>
              )
            }
            <div className={styles.walletConfirmBc}>
              <Button
                onClick={this.handlePayConfirmed}
                size="large"
                className={styles.walletConfirmBtn}
                type="primary"
                disabled={!this.props?.payBox?.password}
                full
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
    const { options = {} } = this.props?.payBox;
    const { amount } = options;
    return (
      <div>
        <div className={styles.payconfirmWrapper}>
          {/* 头部 */}
          <div className={styles.payTitle}>支付</div>
          {/* 支付金额显示 */}
          <div className={styles.payMoney}>支付金额 <span className={styles.payM}>￥{amount}</span></div>
          {/* tab切换支付方式 */}
          <div>
            <div className={styles.payTab_top}>
              <Radio.Group value={this.props.payBox.payWay} onChange={this.handleChangePaymentType}>
                <Radio
                  name={'weixin'}
                  className={`${styles.payTab} `}
                >
                  微信支付
              </Radio>
                <Radio
                  name={'wallet'}
                  className={`${styles.payTab}`}
                >
                  钱包支付
              </Radio>
              </Radio.Group>
            </div>
            <Divider />
            {/* 渲染不同方式的支付内容 */}
            <div className={styles.payTab_bottom}>{this.renderDiffPaymementContent()}</div>
          </div>
          {/* 关闭按钮 */}
          <div
            onClick={this.onClose}
            className={styles.paymentCloseBtn}
          >
            X
          </div>
        </div>
      </div>
    );
  }
}
