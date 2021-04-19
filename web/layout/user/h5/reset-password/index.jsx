import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneInput from '@common/module/h5/PhoneInput/index';
import HeaderLogin from '@common/module/h5/HeaderLogin';

@inject('site')
@inject('user')
@inject('thread')
@inject('resetPassword')
@observer
class ResetPasswordH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { resetPassword } = this.props;
    resetPassword.mobile = phoneNum;
  };

  handlePhoneCodeCallback = (code) => {
    const { resetPassword } = this.props;
    resetPassword.code = code;
  };

  handleSendCodeButtonClick = async () => {
    try {
      await this.props.resetPassword.sendCode();
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };

  handleResetPasswordButtonClick = async () => {
    try {
      await this.props.resetPassword.resetPassword();

      Toast.success({
        content: '重置密码成功',
        hasMask: false,
        duration: 1000,
      });

      setTimeout(() => {
        this.props.router.push('/user/login');
      }, 1000);
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };

  render() {
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>找回/重设密码</div>
          <PhoneInput
            phoneNumCallback={this.handlePhoneNumCallback}
            phoneCodeCallback={this.handlePhoneCodeCallback}
            sendCodeCallback={this.handleSendCodeButtonClick}
            codeTimeout={this.props.resetPassword.codeTimeout}
          />
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value={this.props.resetPassword.newPassword}
            placeholder="新密码"
            onChange={(e) => {
              this.props.resetPassword.newPassword = e.target.value;
            }}
          />
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value={this.props.resetPassword.newPasswordRepeat}
            placeholder="重复新密码"
            onChange={(e) => {
              this.props.resetPassword.newPasswordRepeat = e.target.value;
            }}
          />
          <Button className={layout.button} type="primary" onClick={this.handleResetPasswordButtonClick}>
            下一步
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(ResetPasswordH5Page);
