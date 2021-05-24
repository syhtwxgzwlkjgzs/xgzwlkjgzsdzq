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

@inject('site')
@inject('user')
@inject('h5QrCode')
@observer
class WeixinBindQrCodePage extends React.Component {
  async componentDidMount() {
    try {
      const { sessionToken, loginType, nickname } = this.props.router.query;
      const { platform, wechatEnv } = this.props.site;
      const qrCodeType = platform === 'h5' ? 'mobile_browser_bind' : 'pc_bind';
      await this.props.h5QrCode.generate({
        params: {
          sessionToken,
          type: wechatEnv === 'miniProgram' ? 'pc_bind_mini' : qrCodeType,
          redirectUri: `${encodeURIComponent(`${window.location.origin}/${wechatEnv === 'miniProgram' ? 'pages/' : ''}user/wx-auth${wechatEnv === 'miniProgram' ? '/index' : ''}?loginType=${loginType}&action=wx-bind&nickname=${nickname}`)}`,
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

  componentWillUnmount() {
    clearInterval(this.timer);
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
        if (this.props.h5QrCode.countDown) {
          this.props.h5QrCode.countDown = this.props.h5QrCode.countDown - 3;
        } else {
          clearInterval(this.timer);
        }
        // 跳转状态页
        if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
          this.props.commonLogin.setStatusMessage(e.Code, e.Message);
          this.props.router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
        }
      }
    }, 3000);
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    const { nickname } = this.props.router.query;
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
            orCodeImg={this.props.h5QrCode.qrCode}
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
