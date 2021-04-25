import React, { Component } from 'react';
import styles from './index.module.scss';
import { Dialog, Button, Checkbox, Icon, Input } from '@discuzq/design';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      isSelectedKey: 'wallet',
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     isShow: true,
    //   });
    // }, 1000);
  }

  onCloseBtn = () => {
    this.setState({
      isShow: false,
    });
  };

  changePayment = (type) => {
    this.setState({
      isSelectedKey: type
    })
  }

  renderDiffPaymementContent = () => {
    const { isSelectedKey } = this.state;
    if (isSelectedKey == 'wechat') {
      return this.renderWechatCodePaymementContent();
    } else if (isSelectedKey == 'wallet') {
      return this.renderWalletPaymementContent();
    }
  };

  // 渲染微信支付内容
  renderWechatCodePaymementContent = () => {
    return (
      <div className={styles.wechatPayment}>
        {/* 二维码 */}
        <div className={styles.wPaymentCode}>
          <img />
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
  };

  // 渲染钱包支付内容
  renderWalletPaymementContent = () => {
    return (
      <div className={styles.walletPayment}>
        <div className={styles.walletTitle}>
          <Icon className={styles.icon} name="PayOutlined" size="30" color={'#1878f3'} />
          钱包支付
        </div>
        <div className={styles.walletDec}>
          <span>钱包余额</span>
          <span className={styles.walletBalance}>￥324.00</span>
        </div>
        <div className={styles.walletDec}>
          <span>支付密码</span>
          {/* <span>钱包支付，需 <span className={styles.walletSettingPwd}>设置支付密码</span></span> */}
          <Input mode="password" className={styles.walletChangePwd} placeholder="请输入密码" />
          <Button size="large" className={styles.walletConfirmBtn} type="primary">确认支付</Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Dialog visible={this.state.isShow} position="center" maskClosable={true}>
          <div className={styles.payconfirmWrapper}>
            {/* 头部 */}
            <div className={styles.payTitle}>支付</div>
            {/* 支付金额显示 */}
            <div className={styles.payMoney}>支付金额 ￥9.90</div>
            {/* tab切换支付方式 */}
            <div>
              <div className={styles.payTab_top}>
                <a onClick={() => {this.changePayment('wechat')}} className={styles.payTab}>微信支付</a>
                <a onClick={() => {this.changePayment('wallet')}} className={styles.payTab}>钱包支付</a>
              </div>
              <hr />
              {/* 渲染不同方式的支付内容 */}
              <div className={styles.payTab_bottom}>{this.renderDiffPaymementContent()}</div>
            </div>
            {/* 关闭按钮 */}
            <div onClick={this.onCloseBtn} className={styles.paymentCloseBtn}>
              X
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
