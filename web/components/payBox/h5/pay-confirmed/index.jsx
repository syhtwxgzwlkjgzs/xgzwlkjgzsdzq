import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Button, Radio } from '@discuzq/design';
// import browser from '@common/utils/browser';
import Router from '@common/utils/web-router';

@inject('site')
@inject('user')
@inject('payBox')
@observer
export default class PayBox extends React.Component {
  constructor(props) {
    super(props);
    const { site } = props;
    const { webConfig } = site;
    const { wxpayClose, wxpayIos } = webConfig;

    const payConfig = [
      {
        name: '钱包支付',
        icon: 'PayOutlined',
        color: '#1878f3',
        value: '1',
      },
    ];

    // if ( browser.env('weixin') && wxpayClose ) {
    //     if ( browser.env(ios) && wxpayIos) {
    //         payConfig.unshift(
    //             {
    //                 name: '微信支付',
    //                 icon: 'PayOutlined',
    //                 color: '#09bb07',
    //                 value: '0',
    //             }
    //         );
    //     }
    // }

    this.state = {
      isShow: false,
      payConfig,
    };
    this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     isShow: true,
    //   });
    // }, 1000);
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
    return <p className={styles.subText}>钱包余额：￥{walletBalance}</p>;
  }

  goSetPayPwa() {
    Router.push('/modify/paypwd?token=1');
  }

  render() {
    const { visible = true, onClose = () => {} } = this.props;
    const { user, site } = this.props;
    const { payConfig } = this.state;
    // console.log(user);
    // console.log(site);
    return (
      <Popup position="bottom" maskClosable={true} visible={this.state.isShow} onClose={onClose}>
        <div className={styles.payBox}>
          <div className={styles.title}>
            <p>支付金额：￥9.90</p>
          </div>
          <div className={styles.list}>
            {payConfig.map((item, key) => {
              return (
                <div key={key} className={styles.listItem}>
                  <div className={styles.left}>
                    <Icon className={styles.icon} name={item.icon} color={item.color} size={20} />
                    <p className={styles.text}>{item.name}</p>
                  </div>
                  <div className={styles.right}>
                    {item.value === '1' && this.walletPaySubText()}
                    <Radio />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.tips}>
            <p>asdadsadsd</p>
          </div>
          <div className={styles.btnBox}>
            <Button className={styles.btn} type="primary" size="large" full>
              确认支付￥1元
            </Button>
            <Button className={styles.btn} size="large" full>
              取消
            </Button>
          </div>
        </div>
      </Popup>
    );
  }
}
