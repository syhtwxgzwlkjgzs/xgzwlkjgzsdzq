import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Icon, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import WeixinQrCode from '@components/login/wx-qr-code';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { get } from '@common/utils/get';
import PopProtocol from '../components/pop-protocol';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import PcBodyWrap from '../components/pc-body-wrap';

@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXLoginH5Page extends React.Component {
  timer = null;
  async componentDidMount() {
    try {
      const { site } = this.props;

      if (site?.wechatEnv === 'none') return;

      const redirectUri = `${encodeURIComponent(`${window.location.origin}/user/wx-authorization?type=${platform}`)}`;
      let params;
      const { platform } = site;
      if (platform === 'h5') {
        params = {
          type: 'mobile_browser_login',
          redirectUri,
        };
      }
      console.log(site.isMiniProgramOpen, site.isOffiaccountOpen);
      if (platform === 'pc') {
        const type = site?.isMiniProgramOpen ?  'pc_login_mini' : 'pc_login';
        params = {
          type,
          redirectUri,
        };
      }

      await this.props.h5QrCode.generate({ params });
      if (platform === 'pc') {
        this.queryLoginState(params.type);
      }
    } catch (e) {
      console.log(e);
      Toast.error({
        content: e.Message || e,
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
        const res = await this.props.h5QrCode.login({
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
    const { site, commonLogin } = this.props;
    const { platform } = site;
    const isAnotherLoginWayAvaliable = this.props.site.isSmsOpen || this.props.site.isUserLoginVisible;
    return (
      <PcBodyWrap>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>微信登录</div>
          {/* 二维码 start */}
          <WeixinQrCode
            orCodeImg={this.props.h5QrCode.qrCode}
            orCodeTips={platform === 'h5' ? '长按保存二维码，并在微信中识别此二维码，即可完成登录' : '请使用微信，扫码登录'}
          />
          {/* 二维码 end */}
          {isAnotherLoginWayAvaliable && <div className={platform === 'h5' ? layout['otherLogin-title'] : layout.pc_otherLogin_title}>其他登录方式</div>}
          <div className={platform === 'h5' ? layout['otherLogin-button'] : layout.pc_otherLogin_button}>
            {this.props.site.isUserLoginVisible && (
              <span
                onClick={() => {
                  this.props.router.push('/user/username-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-weixin'] : layout.button_left}
              >
                <Icon size={20} name='UserOutlined' color='#4084FF'/>
              </span>
            )}
            {this.props.site.isSmsOpen && (
              <span
                onClick={() => {
                  this.props.router.push('/user/phone-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-user'] : layout.button_right}
              >
                <Icon size={20} name='PhoneOutlined' color='#FFC300'/>
              </span>
            )}
          </div>
          <div className={platform === 'h5' ? layout['otherLogin-outer__tips'] : layout.pc_otherLogin_tips} >
            注册登录即表示您同意
            <span onClick={() => {
              if (platform === 'pc') {
                window.open('/user/agreement?type=register');
              }
              commonLogin.setProtocolInfo('register');
            }}>《注册协议》</span>
            <span onClick={() => {
              if (platform === 'pc') {
                window.open('/user/agreement?type=privacy');
              }
              commonLogin.setProtocolInfo('privacy');
            }}>《隐私协议》</span>
          </div>
        </div>
      </div>
      {
        platform === 'h5'
          ? <PopProtocol protocolVisible={commonLogin.protocolVisible} protocolStatus={commonLogin.protocolStatus}/>
          : <></>
      }
      </PcBodyWrap>
    );
  }
}

export default withRouter(WXLoginH5Page);
