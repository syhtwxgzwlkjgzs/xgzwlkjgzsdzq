import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import WeixinQrCode from '@common/module/h5/WeixinQrCode';
import HeaderLogin from '@common/module/h5/HeaderLogin';

@inject('site')
@inject('user')
@inject('h5QrCode')
@observer
class WeixinBindQrCodePage extends React.Component {
  async componentDidMount() {
    const { sessionToken, loginType }  = this.props.router.query;
    await this.props.h5QrCode.generate({ params:
        {
          sessionToken,
          type: 'mobile_browser_bind',
          redirectUri: `${encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-select?loginType=${loginType}`)}` } });
  }

  render() {
    return (
      <div className={layout.container}>
          <HeaderLogin/>
          <div className={layout.content}>
              <div className={layout.title}>绑定微信号</div>
              <div className={layout.tips}>
              <img src="/user.png" alt=""/>
              {/* todo 小虫替换为用户名*/}
              小虫，请绑定您的微信
              </div>
              {/* 二维码 start */}
              <WeixinQrCode orCodeImg={this.props.h5QrCode.qrCode} orCodeTips='长按保存二维码，并在微信中识别此二维码，即可绑定微信，并继续访问'/>
              {/* 二维码 end */}
          </div>
      </div>
    );
  }
}

export default withRouter(WeixinBindQrCodePage);
