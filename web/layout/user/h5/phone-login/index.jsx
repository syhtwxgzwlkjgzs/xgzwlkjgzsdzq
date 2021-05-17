import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneInput from '@components/login/phone-input';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { MOBILE_LOGIN_STORE_ERRORS } from '@common/store/login/mobile-login-store';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';
import { genMiniScheme } from '@server';
import browser from '../../../../../common/utils/browser';


@inject('site')
@inject('user')
@inject('thread')
@inject('commonLogin')
@inject('mobileLogin')
@observer
class LoginPhoneH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { mobileLogin } = this.props;
    mobileLogin.mobile = phoneNum;
  };

  handlePhoneCodeCallback = (code) => {
    const { mobileLogin } = this.props;
    mobileLogin.code = code;
  };

  handleLoginButtonClick = async () => {
    try {
      const resp = await this.props.mobileLogin.login();
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      // 暂不实现
      setTimeout(() => {
        window.location.href = '/index';
      }, 1000);
    } catch (e) {
      if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_BIND_USERNAME.Code) {
        this.props.commonLogin.needToSetNickname = true;
        this.props.router.push('/user/bind-nickname');
        return;
      }

      if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_COMPLETE_REQUIRED_INFO.Code) {
        this.props.commonLogin.needToCompleteExtraInfo = true;
        this.props.router.push('/user/supplementary');
        return;
      }

      if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_ALL_INFO.Code) {
        this.props.commonLogin.needToSetNickname = true;
        this.props.commonLogin.needToCompleteExtraInfo = true;
        this.props.router.push('/user/bind-nickname?needToCompleteExtraInfo=true');
        return;
      }

      // 微信绑定
      if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_BIND_WECHAT.Code) {
        const { wechatEnv, platform } = this.props.site;
        if (wechatEnv === 'miniProgram' && platform === 'h5') {
          this.props.commonLogin.needToBindMini = true;
          this.props.commonLogin.sessionToken = e.sessionToken;
          const resp = await genMiniScheme();
          if (resp.code === 0) {
            window.location.href = `${get(resp, 'data.openLink', '')}?sessionToken=${e.sessionToken}`;
            return;
          }
          Toast.error({
            content: '网络错误',
            hasMask: false,
            duration: 1000,
          });
          return;
        }
        this.props.commonLogin.needToBindWechat = true;
        this.props.commonLogin.sessionToken = e.sessionToken;
        this.props.router.push(`/user/wx-bind-qrcode?sessionToken=${e.sessionToken}&loginType=${platform}&nickname=${e.nickname}`);
        return;
      }

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
  };

  handleSendCodeButtonClick = async () => {
    try {
      const { site } = this.props;
      const { webConfig } = site;
      const { TencentCaptcha } = (await import('@discuzq/sdk/dist/common_modules/sliding-captcha'));
      const qcloudCaptchaAppId = get(webConfig, 'qcloud.qcloudCaptchaAppId', false);
      // 发送前校验
      this.props.mobileLogin.beforeSendVerify();
      // 验证码
      const res = await this.props.commonLogin.showCaptcha(qcloudCaptchaAppId, TencentCaptcha);
      console.log(res);
      if (res.ret === 0) {
        await this.props.mobileLogin.sendCode({
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

  render() {
    const { mobileLogin, site } = this.props;
    const { platform } = site;
    const isAnotherLoginWayAvaliable = this.props.site.wechatEnv !== 'none' || this.props.site.isUserLoginVisible;
    /**
     * TODO 样式这块待修改，pc、h5分开两个文件，类名保持一直，根据platform来判断加载哪个文件的layout
     */
    return (
      <div className={platform === 'h5' ? '' : layout.pc_body_background}>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>手机号码登录/注册</div>
          <PhoneInput
            phoneNum={mobileLogin.mobile}
            captcha={mobileLogin.code}
            phoneNumCallback={this.handlePhoneNumCallback}
            phoneCodeCallback={this.handlePhoneCodeCallback}
            sendCodeCallback={this.handleSendCodeButtonClick}
            codeTimeout={mobileLogin.codeTimeout}
          />
          {/* 登录按钮 start */}
          <Button
            disabled={!mobileLogin.isInvalidCode}
            className={platform === 'h5' ? layout.button : layout.pc_button}
            type="primary"
            onClick={this.handleLoginButtonClick}
          >
            登录
          </Button>
          {/* 登录按钮 end */}
          {isAnotherLoginWayAvaliable && <div className={platform === 'h5' ? layout['otherLogin-title'] : layout.pc_otherLogin_title}>其他登录方式</div>}
          <div className={platform === 'h5' ? layout['otherLogin-button'] : layout.pc_otherLogin_button}>
            {this.props.site.wechatEnv !== 'none' && (
              <span
                onClick={() => {
                  if (browser.env('weixin')) {
                    const redirectEncodeUrl = encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-auth`);
                    window.location.href = `https://discuzv3-dev.dnspod.dev/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
                    return;
                  }

                  this.props.router.push('wx-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-weixin'] : layout.button_left}
              >
                <Icon size={20} name='WechatOutlined' color='#04C160'/>
              </span>
            )}
            {this.props.site.isUserLoginVisible && (
              <span
                onClick={() => {
                  this.props.router.push('username-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-user'] : layout.button_right}
              >
                <Icon size={20} name='UserOutlined' color='#4084FF'/>
              </span>
            )}
          </div>
          <div className={platform === 'h5' ? layout['otherLogin-tips'] : layout.pc_otherLogin_tips} >注册登录即表示您同意<span>《注册协议》</span><span>《隐私协议》</span></div>
        </div>
      </div>
      </div>
    );
  }
}

export default withRouter(LoginPhoneH5Page);
