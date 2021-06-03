import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Dialog, Input, Toast, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import ResetPassword from './reset-paypwd/index';
import FindPassword from './find-paypwd/index';
import throttle from '@common/utils/thottle.js';

@inject('site')
@inject('user')
@inject('payBox')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'set_password', // 步骤 set_password| reset_password | find_password
      isSubmit: false,
    };
  }

  initState = () => {
    this.setState({
      step: 'set_password', // 步骤 set_password| reset_password | find_password
      isSubmit: false,
    });
  };

  componentDidMount() {
    this.initState();
    this.props.payBox.clearPayPassword();
  }

  componentWillUnmount() {
    this.initState();
    this.props.payBox.clearPayPassword();
  }

  // 点击去到下一步
  goToResetPayPwd = () => {
    this.props.payBox
      .getPayPwdResetToken()
      .then((res) => {
        this.setState({
          step: 'reset_password',
        });
        this.props.payBox.oldPayPwd = null;
      })
      .catch((err) => {
        Toast.error({
          content: '密码错误',
          hasMask: false,
          duration: 1000,
        });
        this.props.payBox.oldPayPwd = null;
      });
  };

  // 点击忘记密码
  handleGoToFindPayPwd = () => {
    this.setState({
      step: 'find_password',
    });
  };

  // 初次设置密码
  handleSetPwd = (e) => {
    const securityCode = e.target.value.match(/^[0-9]*$/);
    if (!securityCode) return;
    this.props.payBox.password = securityCode[0];
  };

  // 点击修改旧密码 oldPayPwd
  handleChangeOldPwd = (e) => {
    const securityCode = e.target.value.match(/^[0-9]*$/);
    if (!securityCode) return;
    this.props.payBox.oldPayPwd = securityCode[0];
  };

  // 点击提交 ----> 设置密码password成功 ---> 清空 password状态
  handleSubmit = throttle(async () => {
    const { isSubmit } = this.state;
    if (isSubmit || this.getDisabledWithButton()) return;
    this.setState({
      isSubmit: true,
    });
    const { id } = this.props.user;
    this.props.payBox
      .setPayPassword(id)
      .then((res) => {
        Toast.success({
          content: '设置密码成功',
          hasMask: false,
          duration: 1000,
        });
        this.props.payBox.password = null;
        this.props.user.userInfo.canWalletPay = true;
        this.handleClose();
      })
      .catch((err) => {
        console.error(err);
        Toast.error({
          content: '设置失败请重新设置',
          hasMask: false,
          duration: 1000,
        });
        this.props.payBox.password = null;
      });
  }, 500);

  /**
   * 获取按钮禁用状态
   * @returns true 表示禁用 false表示不禁用
   */
  getDisabledWithButton = () => {
    const payPassword = this.props.payBox?.password;
    const oldPayPwd = this.props.payBox?.oldPayPwd;
    let disabled = false;
    if (this.props.user?.canWalletPay) {
      disabled = !oldPayPwd || oldPayPwd.length !== 6;
    } else {
      disabled = !payPassword || payPassword.length !== 6;
    }
    return disabled;
  };

  // 如果没有设置支付密码 显示设置支付密码
  renderSetPayPwd = () => (
    <div className={styles.inputItem}>
      <Input
        type="number"
        trim
        maxLength={6}
        value={this.props.payBox?.password}
        onChange={this.handleSetPwd}
        placeholder="请设置您的支付密码"
        mode="password"
      />
    </div>
  );

  // 渲染已经设置了支付密码内容
  renderCanPayPwd = () => (
    <>
      <div className={styles.inputItem}>
        <Input
          type="number"
          trim
          maxLength={6}
          value={this.props.payBox?.oldPayPwd}
          mode="password"
          placeholder="请输入旧密码"
          onChange={this.handleChangeOldPwd}
        />
      </div>
      {this.props.site.isSmsOpen && (
        <div onClick={this.handleGoToFindPayPwd} className={styles.tips}>
          忘记旧的支付密码？
        </div>
      )}
    </>
  );

  handleClose = () => {
    this.initState();
    this.props.onClose();
  };

  renderContent = () => {
    const { step, payPassword, oldPayPwd } = this.state;
    if (step === 'set_password') {
      return (
        <div className={styles.userMobileContent}>
          <div className={styles.title}>
            <span className={styles.titleValue}>{this.props.user?.canWalletPay ? '修改支付密码' : '设置支付密码'}</span>
            <Icon onClick={this.handleClose} name="CloseOutlined" />
          </div>
          {this.props.user?.canWalletPay ? this.renderCanPayPwd() : this.renderSetPayPwd()}
          <div className={styles.bottom}>
            {this.props.user?.canWalletPay ? (
              <Button
                disabled={this.getDisabledWithButton()}
                onClick={this.goToResetPayPwd}
                type={'primary'}
                className={styles.btn}
              >
                下一步
              </Button>
            ) : (
              <Button
                disabled={this.getDisabledWithButton()}
                onClick={this.handleSubmit}
                type={'primary'}
                className={styles.btn}
              >
                提交
              </Button>
            )}
          </div>
        </div>
      );
    }
    if (step === 'reset_password') {
      return (
        <div className={styles.userMobileContent}>
          <div className={styles.title}>
            <span className={styles.titleValue}>设置新密码</span>
            <Icon onClick={this.handleClose} name="CloseOutlined" />
          </div>
          <ResetPassword onClose={this.handleClose} />
        </div>
      );
    }
    if (step === 'find_password') {
      return <FindPassword onClose={this.handleClose} />;
    }
    return null;
  };

  render() {
    return (
      <div className={styles.userMobileWrapper}>
        <Dialog visible={this.props.visible} onClose={this.handleClose}>
          {this.renderContent()}
        </Dialog>
      </div>
    );
  }
}

export default index;
