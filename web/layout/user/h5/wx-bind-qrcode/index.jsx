import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import WeixinQrCode from '@components/login/wx-qr-code';
import HomeHeader from '@components/home-header';
import Header from '@components/header';

@inject('site')
@inject('user')
@inject('h5QrCode')
@observer
class WeixinBindQrCodePage extends React.Component {
  async componentDidMount() {
    const { sessionToken, loginType, nickname } = this.props.router.query;
    const { platform, wechatEnv } = this.props.site;
    const qrCodeType = platform === 'h5' ? 'mobile_browser_bind' : 'pc_bind';
    await this.props.h5QrCode.generate({
      params: {
        sessionToken,
        type: wechatEnv === 'miniProgram' ? 'pc_bind_mini' : qrCodeType,
        redirectUri: `${encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/${wechatEnv === 'miniProgram' ? 'pages/' : ''}user/wx-auth${wechatEnv === 'miniProgram' ? '/index' : ''}?loginType=${loginType}&action=wx-bind&nickname=${nickname}`)}`,
      },
    });
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    const { nickname } = this.props.router.query;
    return (
      <div className={platform === 'h5' ? '' : layout.pc_body_background}>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo/>
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
      </div>
    );
  }
}

export default withRouter(WeixinBindQrCodePage);
