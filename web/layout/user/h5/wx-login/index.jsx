import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import WeixinQrCode from '../../../../components/login/h5/wx-qr-code';
import HeaderLogin from '../../../../components/login/h5/header-login';

@inject('site')
@inject('user')
@inject('h5QrCode')
@observer
class WXLoginH5Page extends React.Component {
  async componentDidMount() {
    await this.props.h5QrCode.generate({ params: { type: 'mobile_browser_login',
      redirectUri: `${encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-auth`)}`}});
  }

  render() {
    const isAnotherLoginWayAvaliable = this.props.site.isSmsOpen || this.props.site.isUserLoginVisible;
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>微信登录</div>
          {/* 二维码 start */}
          <WeixinQrCode
            orCodeImg={this.props.h5QrCode.qrCode}
            orCodeTips="长按保存二维码，并在微信中识别此二维码，即可完成登录"
          />
          {/* 二维码 end */}
          {isAnotherLoginWayAvaliable && <div className={layout['otherLogin-title']}>其他登录方式</div>}
          <div className={layout['otherLogin-button']}>
            {this.props.site.isUserLoginVisible && (
              <span
                onClick={() => {
                  this.props.router.push('/user/username-login');
                }}
                className={layout['otherLogin-button-weixin']}
              >
                <img src="/login-user.png" alt="" />
              </span>
            )}
            {this.props.site.isSmsOpen && (
              <span
                onClick={() => {
                  this.props.router.push('/user/phone-login');
                }}
                className={layout['otherLogin-button-user']}
              >
                <img src="/login-phone.png" alt="" />
              </span>
            )}
          </div>
          <div className={layout['otherLogin-outer__tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
        </div>
      </div>
    );
  }
}

export default withRouter(WXLoginH5Page);
