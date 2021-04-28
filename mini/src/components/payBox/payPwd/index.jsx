import React from 'react';
import styles from './index.module.scss';
import { Toast, Dialog } from '@discuzq/design';
// import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import { STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('site')
@inject('user')
@inject('payBox')
@observer
class PayPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      target: 0,
    };
    this.keyboardClickHander = this.keyboardClickHander.bind(this);
    this.renderPwdItem = this.renderPwdItem.bind(this);
  }

  componentDidMount() {}

  keyboardClickHander(e) {
    // const key = e.target.getAttribute('data-key');
    const key = e.target.dataset?.key;
    if (key == null) {
      return null;
    }
    const { list } = this.state;

    if (key === '-1') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    } else if (list.length < 6) {
      this.setState(
        {
          list: [].concat(list, [key]),
        },
        () => {
          if (this.state.list.length === 6) {
            this.submitPwa();
          }
        },
      );
    }
  }

  async submitPwa() {
    let { list = [] } = this.state;
    let pwd = list.join('');
    this.props.payBox.password = pwd;
    if (this.props.payBox.step === STEP_MAP.WALLET_PASSWORD) {
      // 表示钱包支付密码
      console.log('进来了', 'ssssss_钱包支付阶段');
      try {
        await this.props.payBox.walletPayOrder();
        Toast.success({
          content: '支付成功',
          hasMask: false,
          duration: 1000,
        });
        await this.props.payBox.clear();
      } catch (error) {
        console.log(error, 'sssssssssss_钱包支付异常回调');
        Toast.error({
          content: '支付失败，请重新输入',
          hasMask: false,
          duration: 1000,
        });
        this.setState({
          list: [],
        });
      }
    } else if (this.props.payBox.step === STEP_MAP.SET_PASSWORD) {
      //表示设置支付密码
      console.log('进来了', 'ssssss_设置密码阶段');
      try {
        let id = this.props.user.id;
        if (!id) return;
        await this.props.payBox.setPayPassword(id);
        await this.props.user.updateUserInfo(id);
        this.props.payBox.step = STEP_MAP.PAYWAY;
        this.props.payBox.visible = true;
      } catch (error) {
        console.log(error, 'sssssssssss_设置支付密码异常回调');
      }
    }
  }

  renderPwdItem() {
    const { list = [] } = this.state;
    const { whetherIsShowPwdBox = true } = this.props;
    const nodeList = list.map((item, key) => (
      <View
        className={`${styles.payListItem} ${styles.activation} ${whetherIsShowPwdBox && styles.payListItem01}`}
        key={key}
      >
        {'*'}
      </View>
    ));
    if (nodeList.length < 6) {
      let curr = false;
      for (let i = nodeList.length; i < 6; i++) {
        if (!curr) {
          curr = true;
          nodeList.push(
            <View
              className={`${styles.payListItem} ${styles.curr} ${whetherIsShowPwdBox && styles.payListItem01}`}
              key={i}
            ></View>,
          );
        } else {
          nodeList.push(
            <View className={`${styles.payListItem} ${whetherIsShowPwdBox && styles.payListItem01}`} key={i}></View>,
          );
        }
      }
    }

    return nodeList;
  }

  // 渲染弹窗形式支付
  renderDialogPayment = () => {
    return (
      <Dialog className={styles.dialogPaymentWrapper} visible={true} position="center" maskClosable={true}>
        <View className={styles.title}>{this.showTitle() || '输入支付密码'}</View>
        <View className={styles.payList}>{this.renderPwdItem()}</View>
      </Dialog>
    );
  };

  showTitle = () => {
    const { step } = this.props?.payBox;
    let title = '输入支付密码';
    switch (step) {
      case STEP_MAP.WALLET_PASSWORD: // 表示钱包支付
        title = '输入支付密码';
        break;
      case STEP_MAP.SET_PASSWORD: // 表示设置支付密码
        title = '设置支付密码';
        break;
      default:
        break;
    }
    return title;
  };

  render() {
    return (
      <View>
        {this.renderDialogPayment()}
        <View className={styles.keyboard} onClick={this.keyboardClickHander}>
          <View className={styles.line}>
            <View data-key="1" className={styles.column}>
              1
            </View>
            <View data-key="2" className={styles.column}>
              2
            </View>
            <View data-key="3" className={styles.column}>
              3
            </View>
          </View>
          <View className={styles.line}>
            <View data-key="4" className={styles.column}>
              4
            </View>
            <View data-key="5" className={styles.column}>
              5
            </View>
            <View data-key="6" className={styles.column}>
              6
            </View>
          </View>
          <View className={styles.line}>
            <View data-key="7" className={styles.column}>
              7
            </View>
            <View data-key="8" className={styles.column}>
              8
            </View>
            <View data-key="9" className={styles.column}>
              9
            </View>
          </View>
          <View className={styles.line}>
            <View className={`${styles.column} ${styles.special}`}></View>
            <View data-key="0" className={styles.column}>
              0
            </View>
            <View data-key="-1" className={`${styles.column} ${styles.special}`}>
              取消
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// eslint-disable-next-line new-cap
export default PayPassword;
