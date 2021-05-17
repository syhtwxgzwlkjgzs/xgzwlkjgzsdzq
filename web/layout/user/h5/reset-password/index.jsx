import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneInput from '@components/login/phone-input';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { get } from '@common/utils/get';


@inject('site')
@inject('user')
@inject('thread')
@inject('commonLogin')
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
      const { site } = this.props;
      const { webConfig } = site;
      const { TencentCaptcha } = (await import('@discuzq/sdk/dist/common_modules/sliding-captcha'));
      const qcloudCaptchaAppId = get(webConfig, 'qcloud.qcloudCaptchaAppId', false);
      // 发送前校验
      this.props.resetPassword.beforeSendVerify();
      // 验证码
      const res = await this.props.commonLogin.showCaptcha(qcloudCaptchaAppId, TencentCaptcha);
      if (res.ret === 0) {
        await this.props.resetPassword.sendCode({
          captchaRandStr: this.props.commonLogin?.captchaRandStr,
          captchaTicket: this.props.commonLogin?.captchaTicket
        });
      }
    } catch (e) {
      console.log(e);
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
    const { site } = this.props;
    const { platform } = site;
    return (
      <div className={platform === 'h5' ? '' : layout.pc_body_background}>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>找回/重设密码</div>
          <PhoneInput
            phoneNum={this.props.resetPassword.mobile}
            captcha={this.props.resetPassword.code}
            phoneNumCallback={this.handlePhoneNumCallback}
            phoneCodeCallback={this.handlePhoneCodeCallback}
            sendCodeCallback={this.handleSendCodeButtonClick}
            codeTimeout={this.props.resetPassword.codeTimeout}
          />
          { platform === 'h5' ? <></> : <div className={layout.tips}>新密码</div> }
          <Input
            clearable={false}
            className={platform === 'h5' ? layout.input : layout.pc_input}
            mode="password"
            value={this.props.resetPassword.newPassword}
            placeholder="新密码"
            onChange={(e) => {
              this.props.resetPassword.newPassword = e.target.value;
            }}
          />
          { platform === 'h5' ? <></> : <div className={layout.tips}>重复新密码</div> }
          <Input
            clearable={false}
            className={platform === 'h5' ? layout.input : layout.pc_input}
            mode="password"
            value={this.props.resetPassword.newPasswordRepeat}
            placeholder="重复新密码"
            onChange={(e) => {
              this.props.resetPassword.newPasswordRepeat = e.target.value;
            }}
          />
          <Button
            className={platform === 'h5' ? layout.button : layout.pc_button}
            type="primary"
            onClick={this.handleResetPasswordButtonClick}
          >
            下一步
          </Button>
        </div>
      </div>
      </div>
    );
  }
}

export default withRouter(ResetPasswordH5Page);
