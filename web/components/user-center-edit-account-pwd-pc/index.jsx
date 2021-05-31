import React, { Component } from 'react';
import styles from './index.module.scss';
import { Avatar, Input, Icon, Dialog, Toast, Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: null, // 旧密码
      newPassword: null, // 新密码
      newPasswordRepeat: null, // 确认密码
    };
  }

  initState = () => {
    this.setState({
      oldPassword: null, // 旧密码
      newPassword: null, // 新密码
      newPasswordRepeat: null, // 确认密码
    });
  };

  componentDidMount() {
    this.initState();
  }

  componentWillUnmount() {
    this.initState();
  }

  // 点击忘记密码
  handleResetPwd = () => {
    Router.push({ url: '/user/reset-password' });
  };

  // 输入旧密码
  handleSetOldPwd = (e) => {
    this.setState({
      oldPassword: e.target.value,
    });
  };

  // 设置账户密码
  handleSetPwd = (e) => {
    this.setState({
      newPassword: e.target.value,
    });
  };

  // 确认新密码
  hadleNewPasswordRepeat = (e) => {
    this.setState({
      newPasswordRepeat: e.target.value,
    });
  };

  // 点击提交
  handleSubmit = async () => {
    const { oldPassword, newPassword, newPasswordRepeat } = this.state;
    if (newPassword !== newPasswordRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      });
      return;
    }
    this.props.user.oldPassword = oldPassword;
    this.props.user.newPassword = newPassword;
    this.props.user.newPasswordRepeat = newPasswordRepeat;
    if (this.props.user.hasPassword) {
      this.props.user
        .resetUserPassword()
        .then((res) => {
          Toast.success({
            content: '修改密码成功',
            hasMask: false,
            duration: 1000,
          });
        })
        .catch((err) => {
          console.log(err)
          Toast.error({
            content: err.Message || '修改密码失败, 请重新设置',
            hasMask: false,
            duration: 1000,
          });
          this.props.user.newPassword = null;
          this.props.user.newPasswordRepeat = null;
          this.initState();
        });
    } else {
      this.props.user
        .setUserPassword()
        .then((res) => {
          Toast.success({
            content: '设置密码成功',
            hasMask: false,
            duration: 1000,
          });
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '设置密码失败, 请重新设置',
            hasMask: false,
            duration: 1000,
          });
          this.props.user.oldPassword = null;
          this.props.user.newPassword = null;
          this.props.user.newPasswordRepeat = null;
          this.initState();
        });
    }
  };

  renderHasNoPassword = () => {
    const { newPassword, newPasswordRepeat } = this.state;
    return (
      <>
        <div className={styles.inputItem}>
          <Input trim onChange={this.handleSetPwd} mode="password" placeholder="请设置密码" value={newPassword} />
        </div>
        <div className={styles.inputItem}>
          <Input
            trim
            mode="password"
            placeholder="请确认密码"
            value={newPasswordRepeat}
            onChange={this.hadleNewPasswordRepeat}
          />
        </div>
      </>
    );
  };

  renderHasPassword = () => {
    const { newPassword, newPasswordRepeat, oldPassword } = this.state;
    return (
      <>
        <div className={styles.inputItem}>
          <Input trim onChange={this.handleSetOldPwd} value={oldPassword}  mode="password" placeholder="请输入旧密码" />
        </div>
        <div className={styles.inputItem}>
          <Input trim value={newPassword} onChange={this.handleSetPwd} mode="password" placeholder="请输入新密码" />
        </div>
        <div className={styles.inputItem}>
          <Input
            trim
            onChange={this.hadleNewPasswordRepeat}
            mode="password"
            value={newPasswordRepeat}
            placeholder="请重复输入新密码"
          />
        </div>
      </>
    );
  };

  render() {
    const { oldPassword, newPassword, newPasswordRepeat } = this.state;
    let isSubmit = false;
    if (this.props.user?.hasPassword) {
      isSubmit = !oldPassword || !newPassword || !newPasswordRepeat;
    } else {
      isSubmit = !newPassword || !newPasswordRepeat;
    }
    return (
      <div className={styles.userMobileWrapper}>
        <Dialog visible={this.props.visible} position="center" maskClosable={true} onClose={this.props.onClick}>
          <div className={styles.userMobileContent}>
            <div className={styles.title}>
              {this.props.user?.hasPassword ? '修改密码' : '设置密码'}
              <Icon onClick={this.handleClose} name="CloseOutlined" onClick={this.props.onClick} />
            </div>
            {this.props.user?.hasPassword ? this.renderHasPassword() : this.renderHasNoPassword()}
            {this.props.user?.hasPassword && (
              <div onClick={this.handleResetPwd} className={styles.tips}>
                忘记旧密码？
              </div>
            )}
            <div className={styles.bottom}>
              <Button onClick={this.handleSubmit} disabled={isSubmit} type={'primary'} className={styles.btn}>
                提交
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
