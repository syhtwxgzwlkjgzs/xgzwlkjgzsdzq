import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData';
import Router from '@discuzq/sdk/dist/router';
import GetQueryString from '../../../common/utils/get-query-string';

@inject('user')
@inject('payBox')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payPassword: null, // 支付密码
      oldPayPwd: null, // 旧密码
    };
  }

  initState = () => {
    this.setState({
      payPassword: null,
      oldPayPwd: null,
    });
    this.props.payBox.password = null;
  };

  componentDidMount() {
    this.initState();
  }

  componentWillUnmount() {
    this.initState();
  }

  // 点击去到下一步
  goToResetPayPwd = () => {
    const { oldPayPwd } = this.state;
    console.log(oldPayPwd);
    this.props.payBox.oldPayPwd = oldPayPwd;
    this.props.payBox
      .getPayPwdResetToken()
      .then((res) => {
        Router.push({ url: '/my/edit/reset-paypwd' });
      })
      .catch((err) => {
        console.error(err);
        Toast.error({
          content: '密码错误',
          hasMask: false,
          duration: 1000,
        });
      });
  };

  // 点击忘记密码
  handleGoToFindPayPwd = () => {
    Router.push({ url: '/my/edit/find-paypwd' });
  };

  // 初次设置密码
  handleSetPwd = (e) => {
    this.setState({
      payPassword: e.target.value,
    });
  };

  // 点击修改旧密码
  handleChangeOldPwd = (e) => {
    this.setState({
      oldPayPwd: e.target.value,
    });
  };

  // 点击提交
  handleSubmit = async () => {
    const { payPassword } = this.state;
    const { id } = this.props.user;
    this.props.payBox.password = payPassword;
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
        }
        Router.back();
        this.initState();
      })
      .catch((err) => {
        console.log(err);
        Toast.error({
          content: '设置失败请重新设置',
          hasMask: false,
          duration: 1000,
        });
        this.initState();
      });
  };

  // 如果没有设置支付密码 显示设置支付密码
  renderSetPayPwd = () => {
    const { payPassword } = this.state;
    return (
      <div className={styles.content}>
        <h3>设置支付密码</h3>
        <div className={styles.paypwdInput}>
          <Input type="number" maxLength={6} value={payPassword} onChange={this.handleSetPwd} placeholder="请设置您的支付密码" mode="password" />
        </div>
      </div>
    );
  };

  // 渲染已经设置了支付密码内容
  renderCanPayPwd = () => {
    const { oldPayPwd } = this.state;
    return (
      <div className={styles.content}>
        <h3>修改密码</h3>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}>
            <Input type="number" maxLength={6} value={oldPayPwd} mode="password" placeholder="请输入旧密码" onChange={this.handleChangeOldPwd} />
          </div>
          <div onClick={this.handleGoToFindPayPwd} className={styles.tips}>
            忘记旧密码？
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { payPassword, oldPayPwd } = this.state;
    return (
      <div>
        <Header />
        {this.props.user?.canWalletPay ? this.renderCanPayPwd() : this.renderSetPayPwd()}
        <div className={styles.bottom}>
          {this.props.user?.canWalletPay ? (
            <Button full disabled={!oldPayPwd || oldPayPwd.length !== 6} onClick={this.goToResetPayPwd} type={'primary'} className={styles.btn}>
              下一步
            </Button>
          ) : (
        <Button full disabled={!payPassword || payPassword.length !== 6} onClick={this.handleSubmit} type={'primary'} className={styles.btn}>
          提交
            </Button>
          )}
      </div>
      </div >
    );
  }
}

export default HOCFetchSiteData(withRouter(index));
