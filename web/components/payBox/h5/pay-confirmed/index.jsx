import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Button, Radio } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import { PAY_MENT_MAP, PAYWAY_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';
import { listenWXJsBridgeAndExecCallback,onBridgeReady } from '../../../../../common/store/pay/weixin-h5-backend';
// import browser from '@common/utils/browser';

@inject('site')
@inject('user')
@inject('payBox')
@observer
export default class PayBox extends React.Component {
  constructor(props) {
    super(props);
    const { site } = props;
    // const { webConfig } = site;
    // const { wxpayClose, wxpayIos } = webConfig;

    const payConfig = [
      {
        name: '钱包支付',
        icon: 'PayOutlined',
        color: '#1878f3',
        paymentType: 20,
      },
    ];

    // if ( browser.env('weixin') && wxpayClose ) {
    //     if ( browser.env(ios) && wxpayIos) {
    payConfig.unshift({
      name: '微信支付',
      icon: 'PayOutlined',
      color: '#09bb07',
      paymentType: 11,
    });
    //     }
    // }

    this.state = {
      isShow: false,
      payConfig,
      paymentType: '',
    };
    this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props?.user;
    try {
      await this.props.payBox.getWalletInfo(id);
    } catch (error) {
    }
  }

  walletPaySubText() {
    const { site, user } = this.props;
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
    this.props.payBox.step = STEP_MAP.SET_PASSWORD
    this.props.payBox.visible = false
  }

  /**
   * 选择支付方式
   */
  handleChangePaymentType = (value) => {
    this.setState({
      paymentType: value,
    }, ()=> {
      if (value === PAY_MENT_MAP.WALLET) {
        this.props.payBox.payWay = PAYWAY_MAP.WALLET
      } else if (value === PAY_MENT_MAP.WX_H5) {
        this.props.payBox.payWay = PAYWAY_MAP.WX
      }
    });
  };

  // 点击确认支付
  handlePayConfirmed = () => {
    if (this.state.paymentType === PAY_MENT_MAP.WALLET) {// 表示钱包支付
      this.props.payBox.walletPayEnsure()
      this.props.payBox.visible = false
      // this.goSetPayPwa()
    } else if (this.state.paymentType === PAY_MENT_MAP.WX_H5) { // 表示微信支付
      console.log('进来了','sssssss_点击微信支付');
      this.props.payBox.wechatPayOrder({listenWXJsBridgeAndExecCallback,onBridgeReady})
      // this.props.payBox.visible = false
    }
  };

  render() {
    const { options = {} } = this.props.payBox;
    const { payConfig, paymentType, checked } = this.state;
    // console.log(user);
    // console.log(site);
    return (
      <div className={styles.payBox}>
        <div className={styles.title}>
          <p>支付金额：￥{options.amount}</p>
        </div>
        <div className={styles.list}>
          <Radio.Group
            value={paymentType}
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
                    {item.paymentType === PAY_MENT_MAP.WALLET && this.walletPaySubText()}
                    <Radio name={item.paymentType} />
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
          <Button className={styles.btn} type="primary" size="large" full onClick={this.handlePayConfirmed}>
            确认支付￥{options.amount} 元
          </Button>
          <Button className={styles.btn} size="large" full>
            取消
          </Button>
        </div>
      </div>
    );
  }
}
