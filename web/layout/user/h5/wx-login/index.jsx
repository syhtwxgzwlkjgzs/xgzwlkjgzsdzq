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
import Protocol from '../components/protocol';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import PcBodyWrap from '../components/pc-body-wrap';
import { genMiniScheme } from '@/common/server';

@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@inject('invite')
@observer
class WXLoginH5Page extends React.Component {
  timer = null;
  async componentDidMount() {
    try {
      const { site, invite, router } = this.props;

      if (site?.wechatEnv === 'none') return;

      const { platform } = site;

      let inviteCode = invite.getInviteCode(router);
      if (inviteCode) inviteCode = `&inviteCode=${inviteCode}`;

      const redirectUri = `${encodeURIComponent(`${window.location.origin}/user/wx-authorization?type=${platform}${inviteCode}`)}`;
      let params;
      if (platform === 'h5' && site?.isMiniProgramOpen) {
        // 在h5 浏览器中 且小程序设置打开 通过小程序schema跳转
        const resp = await genMiniScheme();
        if (resp.code === 0) {
          window.location.href = `${get(resp, 'data.openLink', '')}?${inviteCode.substr(1)}`;
          return;
        }
      }

      // 在h5浏览器中，且公众号设置打开
      params = {
        type: 'mobile_browser_login',
        redirectUri,
      };

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
        clearInterval(this.timer);
        const uid = get(res, 'data.uid');
        this.props.user.updateUserInfo(uid);
        // FIXME: 使用 window 跳转用来解决，获取 forum 在登录前后不同的问题，后续需要修改 store 完成
        window.location.href = '/';
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
    // 接受监听一下协议的数据，不能去掉，去掉后协议的点击无反应
    const { protocolVisible } = commonLogin;
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
                  this.props.router.replace('/user/username-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-weixin'] : layout.button_left}
              >
                <Icon size={20} name='UserOutlined' color='#4084FF'/>
              </span>
            )}
            {this.props.site.isSmsOpen && (
              <span
                onClick={() => {
                  this.props.router.replace('/user/phone-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-user'] : layout.button_right}
              >
                <Icon size={20} name='PhoneOutlined' color='#FFC300'/>
              </span>
            )}
          </div>
          <Protocol/>
        </div>
      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(WXLoginH5Page);
