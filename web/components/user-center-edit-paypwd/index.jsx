import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData';
import Router from '@discuzq/sdk/dist/router';
import GetQueryString from '../../../common/utils/get-query-string';
import throttle from '@common/utils/thottle.js';

@inject('site')
@inject('user')
@inject('payBox')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmit: false,
    };
  }

  componentDidMount() {
    this.props.payBox.clearPayPassword();
  }

  // 点击去到下一步 ---> 清空旧密码oldPayPwd状态
  goToResetPayPwd = throttle(() => {
    if (this.getDisabledWithButton()) return;
    this.props.payBox
      .getPayPwdResetToken()
      .then(() => {
        Router.push({ url: '/my/edit/reset-paypwd' });
        this.props.payBox.oldPayPwd = null;
      })
      .catch(() => {
        Toast.error({
          content: '密码错误',
          hasMask: false,
          duration: 1000,
        });
        this.props.payBox.oldPayPwd = null;
      });
  }, 300);

  // 点击忘记密码
  handleGoToFindPayPwd = () => {
    Router.push({ url: '/my/edit/find-paypwd' });
  };

  // 初次设置密码 password
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
        const type = GetQueryString('type');
        if (type === 'paybox') {
          const { id } = this.props?.user;
          this.props.user.updateUserInfo(id);
          this.props.payBox.visible = true;
          this.props.payBox.password = null;
        }
        Router.back();
        this.props.payBox.password = null;
      })
      .catch((err) => {
        console.log(err);
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
  }

  // 如果没有设置支付密码 显示设置支付密码
  renderSetPayPwd = () => (
    <div className={styles.content}>
      <h3>设置支付密码</h3>
      <div className={styles.paypwdInput}>
        <Input
          className={styles.input}
          type="number"
          maxLength={6}
          value={this.props.payBox?.password}
          onChange={this.handleSetPwd}
          placeholder="请设置您的支付密码"
          mode="password"
        />
      </div>
    </div>
  );

  // 渲染已经设置了支付密码内容
  renderCanPayPwd = () => (
    <div className={styles.content}>
      <h3>修改密码</h3>
      <div className={styles.labelInfo}>
        <div className={styles.labelValue}>
          <Input
            className={styles.input}
            type="number"
            maxLength={6}
            value={this.props.payBox?.oldPayPwd}
            mode="password"
            placeholder="请输入旧密码"
            onChange={this.handleChangeOldPwd}
          />
        </div>
        {
          this.props.site?.isSmsOpen && (
            <div onClick={this.handleGoToFindPayPwd} className={styles.tips}>
              忘记旧密码？
            </div>
          )
        }
      </div>
    </div>
  );

  render() {
    return (
      <div id={styles.setPayPwdContent}>
        <Header />
        {this.props.user?.canWalletPay ? this.renderCanPayPwd() : this.renderSetPayPwd()}
        <div className={styles.bottom}>
          {this.props.user?.canWalletPay ? (
            <Button
              full
              disabled={this.getDisabledWithButton()}
              onClick={this.goToResetPayPwd}
              type={'primary'}
              className={styles.btn}
            >
              下一步
            </Button>
          ) : (
            <Button
              full
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
}

export default withRouter(index);
