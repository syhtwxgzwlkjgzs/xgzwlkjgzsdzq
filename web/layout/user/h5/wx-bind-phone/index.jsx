import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import PhoneInput from '@components/login/phone-input';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';

@inject('site')
@inject('user')
@inject('thread')
@inject('wxPhoneBind')
@inject('commonLogin')
@observer
class WXBindPhoneH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { wxPhoneBind } = this.props;
    wxPhoneBind.mobile = phoneNum;
  };

  handlePhoneCodeCallback = (code) => {
    const { wxPhoneBind } = this.props;
    wxPhoneBind.code = code;
  };

  handleSendCodeButtonClick = async () => {
    try {
      const { site } = this.props;
      const { webConfig } = site;
      const { TencentCaptcha } = (await import('@discuzq/sdk/dist/common_modules/sliding-captcha'));
      const qcloudCaptchaAppId = get(webConfig, 'qcloud.qcloudCaptchaAppId', false);
      // 发送前校验
      this.props.wxPhoneBind.beforeSendVerify();
      // 验证码
      const res = await this.props.commonLogin.showCaptcha(qcloudCaptchaAppId, TencentCaptcha);
      console.log(res);
      if (res.ret === 0) {
        await this.props.wxPhoneBind.sendCode({
          captchaRandStr: this.props.commonLogin?.captchaRandStr,
          captchaTicket: this.props.commonLogin?.captchaTicket
        });
      }
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };
  handleBindButtonClick = async () => {
    const { wxPhoneBind, router } = this.props;
    const { sessionToken } = router.query;
    try {
      const resp = await wxPhoneBind.loginAndBind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        duration: 1000,
      });

      setTimeout(() => {
        router.push('/index');
      }, 1000);
    } catch (error) {
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        this.props.router.push(`/user/status?statusCode=${error.Code}&statusMsg=${error.Message}`);
        return;
      }
      Toast.error({
        content: error.Message,
      });
    }
  }

  render() {
    const { wxPhoneBind, router } = this.props;
    const { nickname } = router.query;
    return (
      <div className={layout.container}>
        <HomeHeader hideInfo mode='login'/>
        <div className={layout.content}>
          <div className={layout.title}>手机号登陆，并绑定微信账号</div>
          <div className={layout.tips}>
            hi， 微信用户
            {nickname}
            <br />
            请您登录，即可完成微信号和手机号的绑定
          </div>
          {/* 手机验证码 start */}
          <PhoneInput
            phoneNum={wxPhoneBind.mobile}
            captcha={wxPhoneBind.code}
            phoneNumCallback={this.handlePhoneNumCallback}
            phoneCodeCallback={this.handlePhoneCodeCallback}
            sendCodeCallback={this.handleSendCodeButtonClick}
            codeTimeout={wxPhoneBind.codeTimeout}
          />
          {/* 手机验证码 end */}
          {/* 登录按钮 start */}
          <Button
            className={layout.button}
            type="primary"
            onClick={this.handleBindButtonClick}
          >
            登录并绑定
          </Button>
          <div className={layout['otherLogin-within__tips']}>注册登录即表示您同意<span>《注册协议》</span><span>《隐私协议》</span></div>
        </div>
      </div>
    );
  }
}

export default withRouter(WXBindPhoneH5Page);
