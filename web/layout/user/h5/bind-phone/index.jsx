import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneInput from '@components/login/phone-input';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import clearLoginStatus from '@common/utils/clear-login-status';
import PcBodyWrap from '../components/pc-body-wrap';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';


@inject('site')
@inject('user')
@inject('thread')
@inject('mobileBind')
@inject('commonLogin')
@observer
class BindPhoneH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { mobileBind } = this.props;
    mobileBind.mobile = phoneNum;
  }

  handlePhoneCodeCallback = (code) => {
    const { mobileBind } = this.props;
    mobileBind.code = code;
  }

  handleBindButtonClick = async () => {
    try {
      const { query } = this.props.router;
      const { sessionToken } = query;
      const resp = await this.props.mobileBind.bind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      setTimeout(() => {
        this.props.mobileBind.reset();
        window.location.href = '/';
      }, 1000);
    } catch (e) {
      // 跳转状态页
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        this.props.router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
        return;
      }
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  handleSendCodeButtonClick = async () => {
    try {
      const { site, commonLogin } = this.props;
      const { webConfig } = site;
      const { TencentCaptcha } = (await import('@discuzq/sdk/dist/common_modules/sliding-captcha'));
      const qcloudCaptchaAppId = get(webConfig, 'qcloud.qcloudCaptchaAppId', false);
      // 发送前校验
      this.props.mobileBind.beforeSendVerify();
      // 验证码
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      if (qcloudCaptcha) {
        const res = await this.props.commonLogin.showCaptcha(qcloudCaptchaAppId, TencentCaptcha);
        if (res.ret !== 0) {
          return;
        }
      }
      await this.props.mobileBind.sendCode({
        captchaRandStr: this.props.commonLogin?.captchaRandStr,
        captchaTicket: this.props.commonLogin?.captchaTicket
      });
      commonLogin.setIsSend(true);
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  render() {
    const { mobileBind, site } = this.props;
    const { platform, wechatEnv } = site;
    return (
      <PcBodyWrap>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>绑定手机号</div>
          <div className={platform === 'h5' ? layout.tips : layout.pc_tips}>
            请绑定您的手机号
          </div>
          <PhoneInput
            phoneNum={mobileBind.mobile}  // 手机号
            captcha={mobileBind.code} // 验证码
            phoneNumCallback={this.handlePhoneNumCallback} // 手机号输入时的回调
            phoneCodeCallback={this.handlePhoneCodeCallback} // 验证码输入时的回调
            sendCodeCallback={this.handleSendCodeButtonClick} // 验证码点击时的回调
            codeTimeout={mobileBind.codeTimeout} // 验证码倒计时
          />
          <Button className={platform === 'h5' ? layout.button : layout.pc_button} type="primary" onClick={this.handleBindButtonClick}>
            下一步
          </Button>
          {
            wechatEnv === 'miniProgram'
              ? <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
                  <span className={layout.clickBtn} onClick={() => {
                    window.location.href = '/';
                  }} >跳过</span>
                </div>
              : <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
                  <span className={layout.clickBtn} onClick={() => {
                    clearLoginStatus(); // 清除登录态
                    window.location.replace('/');
                  }} >退出登录</span>
                </div>
          }
        </div>
      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(BindPhoneH5Page);
