import React from 'react';
import styles from './index.module.scss';
import Header from '@components/header';
import { inject, observer } from 'mobx-react';
import CommonPayoffPwd from '../../components/common-paypwd-content';
import { Dialog, Toast } from '@discuzq/design';
import { PAY_BOX_ERROR_CODE_MAP, STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';

@inject('site')
@inject('user')
@inject('payBox')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      target: 0,
    };
    this.keyboardClickHander = this.keyboardClickHander.bind(this);
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
            console.log('进来了', 'ssssssssssss_01');
            this.submitPwa();
            alert(`设置成功,密码为${this.state.list.join(',')}`);
          }
        },
      );
    } else if (type == 'delete') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    }
  };

  keyboardClickHander(e) {
    const key = e.target.getAttribute('data-key');
    if (key == null) {
      return null;
    }
    const { list = [] } = this.state;

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

  // 渲染弹窗形式支付
  renderDialogPayment = () => {
    const { list = [] } = this.state;
    return (
      <Dialog className={{}} visible={true} position="center" maskClosable={true}>
        <CommonPayoffPwd list={list} updatePwd={this.updatePwd} whetherIsShowPwdBox={true} />
      </Dialog>
    );
  };

  render() {
    const { list = [] } = this.state;
    return (
      <div>
        {/* <Header /> */}
        {/* <CommonPayoffPwd list={list} updatePwd={this.updatePwd} /> */}
        {this.renderDialogPayment()}
        <div className={styles.keyboard} onClick={this.keyboardClickHander}>
          <div className={styles.line}>
            <div data-key="1" className={styles.column}>
              1
            </div>
            <div data-key="2" className={styles.column}>
              2
            </div>
            <div data-key="3" className={styles.column}>
              3
            </div>
          </div>
          <div className={styles.line}>
            <div data-key="4" className={styles.column}>
              4
            </div>
            <div data-key="5" className={styles.column}>
              5
            </div>
            <div data-key="6" className={styles.column}>
              6
            </div>
          </div>
          <div className={styles.line}>
            <div data-key="7" className={styles.column}>
              7
            </div>
            <div data-key="8" className={styles.column}>
              8
            </div>
            <div data-key="9" className={styles.column}>
              9
            </div>
          </div>
          <div className={styles.line}>
            <div className={`${styles.column} ${styles.special}`}></div>
            <div data-key="0" className={styles.column}>
              0
            </div>
            <div data-key="-1" className={`${styles.column} ${styles.special}`}>
              取消
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
