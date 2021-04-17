import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneInput from '@common/module/h5/PhoneInput/index';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@inject('mobileLogin')
@observer
class LoginPhoneH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePhoneNumCallback = (phoneNum) => {
    const { mobileLogin } = this.props;
    console.log(phoneNum);
    mobileLogin.mobile = phoneNum;
  }

  handlePhoneCodeCallback = (code) => {
    const { mobileLogin } = this.props;
    console.log(code);
    mobileLogin.code = code;
  }

  handleLoginButtonClick = async () => {
    try {
      const loginData = await this.props.mobileLogin.login();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  handleSendCodeButtonClick = async () => {
    try {
      const sendCodeData = await this.props.mobileLogin.sendCode();
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  render() {
    const { mobileLogin } = this.props;
    return (
        <div className={layout.container}>
            <HeaderLogin/>
            <div className={layout.content}>
                <div className={layout.title}>手机号码登录/注册</div>
                <PhoneInput
                  phoneNumCallback={this.handlePhoneNumCallback}
                  phoneCodeCallback={this.handlePhoneCodeCallback}
                  sendCodeCallback={this.handleSendCodeButtonClick}
                  codeTimeout={mobileLogin.codeTimeout}
                />
                {/* 登录按钮 start */}
                <Button disabled={!mobileLogin.isInvalidCode} className={layout.button} type="primary" onClick={this.handleLoginButtonClick}>
                  登录
                </Button>
                {/* 登录按钮 end */}
                <div className={layout['otherLogin-title']}>其他登录方式</div>
                <div className={layout['otherLogin-button']}>
                  <span onClick={() => {
                    this.props.router.push('weixin-login');
                  }} className={layout['otherLogin-button-weixin']}>
                    <img src="/login-weixin.png" alt=""/>
                  </span>
                  <span onClick={() => {
                    this.props.router.push('login');
                  }} className={layout['otherLogin-button-user']}>
                    <img src='/login-user.png' alt=""/>
                  </span>
                </div>
                <div className={layout['otherLogin-tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
            </div>
        </div>
    );
  }
}

export default withRouter(LoginPhoneH5Page);
