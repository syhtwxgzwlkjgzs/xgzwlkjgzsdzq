import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Toast } from '@discuzq/design';
import WeixinQrCode from '@components/login/wx-qr-code';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { get } from '@common/utils/get';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import PcBodyWrap from '../components/pc-body-wrap';
import { MOBILE_LOGIN_STORE_ERRORS } from '@common/store/login/mobile-login-store';
import { isExtFieldsOpen } from '@common/store/login/util';

@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WeixinBindQrCodePage extends React.Component {
  async componentDidMount() {
    await this.generateQrCode();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async generateQrCode() {
    try {
      const { sessionToken, nickname } = this.props.router.query;
      const { platform, wechatEnv } = this.props.site;
      const qrCodeType = platform === 'h5' ? 'mobile_browser_bind' : 'pc_bind';
      const { user } = this.props;
      let name = nickname;
      if (user.loginStatus) {
        this.props.commonLogin.setUserId(user.id);
        name = user.nickname;
      }

      const redirectUri = `${wechatEnv === 'miniProgram' ? '/subPages/user/wx-auth/index' : `${window.location.origin}/user/wx-auth`}?loginType=${platform}&action=wx-bind&nickname=${name}`;
      await this.props.h5QrCode.generate({
        params: {
          sessionToken,
          type: wechatEnv === 'miniProgram' ? 'pc_bind_mini' : qrCodeType,
          redirectUri: encodeURIComponent(redirectUri),
        },
      });
      this.queryLoginState(wechatEnv === 'miniProgram' ? 'pc_bind_mini' : qrCodeType);
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  queryLoginState(type) {
    this.timer = setInterval(async () => {
      try {
        const res = await this.props.h5QrCode.bind({
          type,
          params: { sessionToken: this.props.h5QrCode.sessionToken },
        });
        const uid = get(res, 'data.uid');
        this.props.user.updateUserInfo(uid);
        // FIXME: 使用 window 跳转用来解决，获取 forum 在登录前后不同的问题，后续需要修改 store 完成
        window.location.href = '/';
        clearInterval(this.timer);
      } catch (e) {
        const { site, h5QrCode, commonLogin, router } = this.props;
        if (h5QrCode.countDown) {
          h5QrCode.countDown = h5QrCode.countDown - 3;
        } else {
          clearInterval(this.timer);
        }
        if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_COMPLETE_REQUIRED_INFO.Code) {
          if (isExtFieldsOpen(site)) {
            commonLogin.needToCompleteExtraInfo = true;
            router.push('/user/supplementary');
            return;
          }
          return window.location.href = '/';
        }
        // 跳转状态页
        if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
          const uid = get(e, 'uid', '');
          uid && this.props.user.updateUserInfo(uid);
          commonLogin.setStatusMessage(e.Code, e.Message);
          router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
        }
      }
    }, 3000);
  }

  render() {
    const { site: { platform }, router, h5QrCode } = this.props;
    const { nickname } = router.query;
    return (
      <PcBodyWrap>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>绑定微信号</div>
          <div className={platform === 'h5' ? layout.tips : layout.pc_tips}>
            {nickname ? `${nickname}，` : ''}请绑定您的微信
          </div>
          {/* 二维码 start */}
          <WeixinQrCode
            refresh={() => {this.generateQrCode()}}
            isValid={h5QrCode.isQrCodeValid}
            orCodeImg={h5QrCode.qrCode}
            orCodeTips={platform === 'h5' ? '长按保存二维码，并在微信中识别此二维码，即可完成登录' : '请使用微信，扫码登录'}
          />
          {/* 二维码 end */}
        </div>
      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(WeixinBindQrCodePage);
