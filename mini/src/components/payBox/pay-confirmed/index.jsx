import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Popup, Icon, Radio } from '@discuzq/design';
// import browser from '@common/utils/browser';
// import Router from '@common/utils/web-router';
import { Button, View, Text, Checkbox } from '@tarojs/components';

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
    // this.goSetPayPwa = this.goSetPayPwa.bind(this);
  }

  walletPaySubText() {
    const { site, user } = this.props;
    const { userInfo = {} } = user;
    const { canWalletPay, walletBalance } = userInfo || {};
    if (!canWalletPay) {
      return (
        <Text className={styles.subText} onClick={this.goSetPayPwa}>
          请设置支付密码
        </Text>
      );
    }
    return <Text className={styles.subText}>钱包余额：￥{walletBalance}</Text>;
  }

  // goSetPayPwa() {
  //   Router.push('/modify/paypwd?token=1');
  // }

  render() {
    const { visible = true, onClose = () => {} } = this.props;
    const { payConfig } = this.state;
    return (
      <Popup position="bottom" maskClosable={true} visible={this.props.visible} onClose={onClose}>
        <View className={styles.payBox}>
          <View className={styles.title}>
            <Text>支付金额：￥9.90</Text>
          </View>
          <View className={styles.list}>
            {payConfig.map((item, key) => {
              return (
                <View key={key} className={styles.listItem}>
                  <View className={styles.left}>
                    <Icon className={styles.icon} name={item.icon} color={item.color} size={20} />
                    <Text className={styles.text}>{item.name}</Text>
                  </View>
                  <View className={styles.right}>
                    {/* {item.value === '1' && this.walletPaySubText()} */}
                    <Radio />
                  </View>
                </View>
              );
            })}
          </View>
          <View className={styles.tips}>
            <Text>asdadsadsd</Text>
          </View>
          <View className={styles.btnBox}>
            <Button className={styles.btn}>
              确认支付￥1元
            </Button>
            <Button className={styles.btn}>
              取消
            </Button>
          </View>
        </View>
      </Popup>
    );
  }
}
