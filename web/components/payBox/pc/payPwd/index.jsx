import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import CommonPayoffPwd from '../../components/common-paypwd-content';
import { STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('site')
@inject('user')
@inject('payBox')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentWillUnmount() {
    this.setState({
      list: []
    })
  }

  updatePwd = (set_num, type) => {
    const { list = [] } = this.state;
    if (type == 'add') {
      let list_ = [...list];
      if (list.length >= 6) {
        list_ = list_.join('').substring(0, 5).split('');
      }
      this.setState(
        {
          list: [].concat(list_, [set_num]),
        },
        () => {
          if (this.state.list.length === 6) {
            this.submitPwa();
          }
        },
      );
    } else if (type == 'delete') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    }
  };

  async submitPwa() {
    let { list = [] } = this.state;
    let pwd = list.join('');
    this.props.payBox.password = pwd;
    if (this.props.payBox.step === STEP_MAP.WALLET_PASSWORD) {
      // 表示钱包支付密码
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

  render() {
    const { list = [] } = this.state;
    return (
      <div className={styles.payPwdWrapper}>
        <CommonPayoffPwd whetherIsShowPwdBox={true} list={list} updatePwd={this.updatePwd} />
      </div>
    );
  }
}
