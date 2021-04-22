import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import { NEED_BIND_WEIXIN_FLAG, NEED_BIND_PHONE_FLAG } from '@common/store/login/user-login-store';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';

@inject('site')
@inject('user')
@inject('thread')
@inject('userLogin')
@inject('commonLogin')
@observer
class LoginH5Page extends React.Component {
  handleUsernameChange = (e) => {
    this.props.userLogin.username = e.target.value;
  };

  handlePasswordChange = (e) => {
    this.props.userLogin.password = e.target.value;
  };

  loginErrorHandler = (e) => {
    // TODO: 完善完这里的所有逻辑
    if (e.Code === NEED_BIND_WEIXIN_FLAG) {
      this.props.commonLogin.needToBindWechat = true;
      this.props.router.push(`/user/wx-bind-qrcode?sessionToken=${e.sessionToken}&loginType=username&nickname=${e.nickname}`);
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
      this.props.router.push('/user/status');
      return;
    }

    Toast.error({
      content: e.Message,
      hasMask: false,
      duration: 1000,
    });
  }

  handleLoginButtonClick = async () => {
    try {
      await this.props.userLogin.login();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      // FIXME: Toast 暂时不支持回调能力
      setTimeout(() => {
        this.props.router.push('/');
        return;
      }, 1000);
    } catch (e) {
      this.loginErrorHandler(e);
    }
  };

  render() {
    const isAnotherLoginWayAvailable = this.props.site.wechatEnv !== 'none' || this.props.site.isSmsOpen;
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>用户名登录</div>
          {/* 输入框 start */}
          <Input
            className={layout.input}
            value={this.props.userLogin.username}
            placeholder="输入您的用户名"
            onChange={this.handleUsernameChange}
          />
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value={this.props.userLogin.password}
            placeholder="输入您的登录密码"
            onChange={this.handlePasswordChange}
          />
          {/* 输入框 end */}
          {/* 登录按钮 start */}
          <Button className={layout.button} type="primary" onClick={this.handleLoginButtonClick}>
            登录
          </Button>
          {/* 登录按钮 end */}
          <div className={layout.functionalRegion}>
            {!(this.props.site.isSmsOpen || this.props.site.wechatEnv !== 'none') && (
              <span
                className={layout.clickBtn}
                onClick={() => {
                  this.props.router.push('register');
                }}
              >
                注册用户
              </span>
            )}
            <span> 忘记密码? </span>
            {this.props.site.isSmsOpen && (
              <span
                className={layout.clickBtn}
                onClick={() => {
                  this.props.router.push('reset-password');
                }}
              >
                找回密码
              </span>
            )}
          </div>
          {isAnotherLoginWayAvailable && <div className={layout['otherLogin-title']}>其他登录方式</div>}
          <div className={layout['otherLogin-button']}>
            {this.props.site.wechatEnv !== 'none' && (
              <span
                onClick={() => {
                  this.props.router.push('wx-login');
                }}
                className={layout['otherLogin-button-weixin']}
              >
                <img src="/login-weixin.png" alt="" />
              </span>
            )}
            {this.props.site.isSmsOpen && (
              <span
                onClick={() => {
                  this.props.router.push('phone-login');
                }}
                className={layout['otherLogin-button-phone']}
              >
                <img src="/login-phone.png" alt="" />
              </span>
            )}
          </div>
          <div className={layout['otherLogin-tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginH5Page);
