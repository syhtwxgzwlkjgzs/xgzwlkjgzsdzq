import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button, Toast, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { NEED_BIND_WEIXIN_FLAG, NEED_BIND_PHONE_FLAG } from '@common/store/login/user-login-store';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';
import { genMiniScheme } from '@server';
import PopProtocol from '../components/pop-protocol';
import browser from '../../../../../common/utils/browser';
import PcBodyWrap from '../components/pc-body-wrap';

@inject('site')
@inject('user')
@inject('thread')
@inject('userLogin')
@inject('commonLogin')
@observer
class UsernameH5Login extends React.Component {
  handleUsernameChange = (e) => {
    this.props.userLogin.username = e.target.value;
  };

  handlePasswordChange = (e) => {
    this.props.userLogin.password = e.target.value;
  };

  loginErrorHandler = async (e) => {
    // 微信绑定
    if (e.Code === NEED_BIND_WEIXIN_FLAG) {
      const { wechatEnv, platform } = this.props.site;
      // 设置缓存
      if (e.uid) {
        this.props.commonLogin.setUserId(e.uid);
      }
      if (wechatEnv === 'miniProgram' && platform === 'h5') {
        this.props.commonLogin.needToBindMini = true;
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

    // 手机号绑定 flag
    if (e.Code === NEED_BIND_PHONE_FLAG) {
      this.props.commonLogin.needToBindPhone = true;
      this.props.router.push(`/user/bind-phone?sessionToken=${e.sessionToken}`);
      return;
    }

    // 跳转状态页
    if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
      this.props.commonLogin.setStatusMessage(e.Code, e.Message);
      this.props.router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
      return;
    }

    Toast.error({
      content: e.Message || e,
      hasMask: false,
      duration: 1000,
    });
  }

  handleLoginButtonClick = async () => {
    try {
      const resp = await this.props.userLogin.login();
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      // FIXME: Toast 暂时不支持回调能力
      // FIXME: 使用 window 跳转用来解决，获取 forum 在登录前后不同的问题，后续需要修改 store 完成
      setTimeout(() => {
        window.location.href = '/';
        return;
      }, 1000);
    } catch (e) {
      this.loginErrorHandler(e);
    }
  };

  render() {
    const { site, commonLogin } = this.props;
    const { platform } = site;
    const isAnotherLoginWayAvailable = this.props.site.wechatEnv !== 'none' || this.props.site.isSmsOpen;
    return (
      <PcBodyWrap>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>用户名登录</div>
          {/* 输入框 start */}
          { platform === 'h5' ? <></> : <div className={layout.tips}>用户名</div> }
          <Input
            className={platform === 'h5' ? layout.input : layout.pc_input}
            clearable={true}
            value={this.props.userLogin.username}
            placeholder="输入您的用户名"
            onChange={this.handleUsernameChange}
          />
          { platform === 'h5' ? <></> : <div className={layout.tips}>登录密码</div> }
          <Input
            clearable={false}
            className={platform === 'h5' ? layout.input : layout.pc_input}
            mode="password"
            value={this.props.userLogin.password}
            placeholder="输入您的登录密码"
            onChange={this.handlePasswordChange}
          />
          {/* 输入框 end */}
          {/* 登录按钮 start */}
          <Button className={platform === 'h5' ? layout.button : layout.pc_button} type="primary" onClick={this.handleLoginButtonClick}>
            登录
          </Button>
          {/* 登录按钮 end */}
          <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
            {site.isRegister && (
              <span
                className={layout.clickBtn}
                onClick={() => {
                  this.props.router.push('register');
                }}
              >
                注册用户
              </span>
            )}
            {this.props.site.isSmsOpen && (
              <>
                <span> 忘记密码? </span>
                <span
                  className={layout.clickBtn}
                  onClick={() => {
                    this.props.router.push('reset-password');
                  }}
                >
                  找回密码
                </span>
              </>
            )}
          </div>
          {isAnotherLoginWayAvailable && <div className={platform === 'h5' ? layout['otherLogin-title'] : layout.pc_otherLogin_title}>其他登录方式</div>}
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
            {this.props.site.isSmsOpen && (
              <span
                onClick={() => {
                  this.props.router.push('phone-login');
                }}
                className={platform === 'h5' ? layout['otherLogin-button-phone'] : layout.button_right}
              >
              <Icon size={20} name='PhoneOutlined' color='#FFC300'/>
              </span>
            )}
          </div>
          <div className={platform === 'h5' ? layout['otherLogin-tips'] : layout.pc_otherLogin_tips} >
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

export default withRouter(UsernameH5Login);
