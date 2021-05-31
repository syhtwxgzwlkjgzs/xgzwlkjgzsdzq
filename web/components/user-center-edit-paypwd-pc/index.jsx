import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Dialog, Input, Toast, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import ResetPassword from './reset-paypwd/index';
import FindPassword from './find-paypwd/index';
import throttle from '@common/utils/thottle.js';

@inject('user')
@inject('payBox')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payPassword: null, // 支付密码
      oldPayPwd: null, // 旧密码
      step: 'set_password', // 步骤 set_password| reset_password | find_password
    };
  }

  initState = () => {
    this.setState({
      payPassword: null,
      oldPayPwd: null,
    });
    this.props.payBox.password = null;
  }

  componentDidMount() {
    this.initState();
  }

  componentWillUnmount() {
    this.initState();
  }

  // 点击去到下一步
  goToResetPayPwd = () => {
    const { oldPayPwd } = this.state;
    this.props.payBox.oldPayPwd = oldPayPwd;
    this.props.payBox.getPayPwdResetToken().then((res) => {
      this.setState({
        step: 'reset_password',
      });
    })
      .catch((err) => {
        Toast.error({
          content: '密码错误',
          hasMask: false,
          duration: 1000,
        });
      });
  }

  // 点击忘记密码
  handleGoToFindPayPwd = () => {
    this.setState({
      step: 'find_password',
    });
  }

  // 初次设置密码
  handleSetPwd = (e) => {
    this.setState({
      payPassword: e.target.value,
    });
  }

  // 点击修改旧密码
  handleChangeOldPwd = (e) => {
    this.setState({
      oldPayPwd: e.target.value,
    });
  }

  // 点击提交
  handleSubmit = throttle(async () => {
    const { payPassword } = this.state;
    const { id } = this.props.user;
    this.props.payBox.password = payPassword;
    this.props.payBox.setPayPassword(id).then((res) => {
      Toast.success({
        content: '设置密码成功',
        hasMask: false,
        duration: 1000,
      });
      this.initState();
    })
      .catch((err) => {
        Toast.error({
          content: '设置失败请重新设置',
          hasMask: false,
          duration: 1000,
        });
        this.initState();
      });
  }, 500)

  // 如果没有设置支付密码 显示设置支付密码
  renderSetPayPwd = () => {
    const { payPassword } = this.state;
    return (
      <div className={styles.inputItem}>
        <Input value={payPassword} onChange={this.handleSetPwd} placeholder="请设置您的支付密码" mode="password" />
      </div>
    );
  }

  // 渲染已经设置了支付密码内容
  renderCanPayPwd = () => {
    const { oldPayPwd } = this.state;
    return (
      <>
        <div className={styles.inputItem}>
          <Input value={oldPayPwd} mode="password" placeholder="请输入旧密码" onChange={this.handleChangeOldPwd} />
        </div>
        <div onClick={this.handleGoToFindPayPwd} className={styles.tips}>忘记旧密码？</div>
      </>
    );
  }

  renderContent = () => {
    const { step, payPassword, oldPayPwd } = this.state;
    if (step === 'set_password') {
      return (
        <div className={styles.userMobileContent}>
          <div className={styles.title}>
            <span className={styles.titleValue}>{this.props.user?.canWalletPay ? '修改密码' : '设置密码'}</span>
            <Icon onClick={this.handleClose} name="CloseOutlined" />
          </div>
          {
            this.props.user?.canWalletPay ? this.renderCanPayPwd() : this.renderSetPayPwd()
          }
          <div className={styles.bottom}>
            {
              this.props.user?.canWalletPay ? <Button disabled={!oldPayPwd} onClick={this.goToResetPayPwd} type={'primary'} className={styles.btn}>下一步</Button> : <Button disabled={!payPassword} onClick={this.handleSubmit} type={'primary'} className={styles.btn}>提交</Button>
            }
          </div>
        </div>
      );
    } if (step === 'reset_password') {
      return (
        <div className={styles.userMobileContent}>
          <div className={styles.title}>
            <span className={styles.titleValue}>设置新密码</span>
            <Icon onClick={this.handleClose} name="CloseOutlined" />
          </div>
          <ResetPassword />
        </div>
      );
    } if (step === 'find_password') {
      return (
        <FindPassword />
      );
    }
    return <></>;
  }

  render() {
    return (
      <div className={styles.userMobileWrapper}>
        <Dialog visible={this.props.visible} onClose={this.props.onClose}>
          {this.renderContent()}
        </Dialog>
      </div>
    );
  }
}

export default index;
