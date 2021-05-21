import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import isWeiXin from '@common/utils/is-weixin';
import clearLoginStatus from '@common/utils/clear-login-status';
import '@discuzq/design/dist/styles/index.scss';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';

@inject('site')
@inject('commonLogin')
@observer
class Login extends React.Component {
  componentDidMount() {
    clearLoginStatus(); // 清除登录态
    if (this.props.site.wechatEnv === 'miniProgram') {
      if (isWeiXin()) {
        const redirectEncodeUrl = encodeURIComponent(`https://${window.location.host}/user/wx-auth`);
        window.location.href = `https://${window.location.host}/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
        return;
      }
      this.props.router.replace('/user/wx-login');
      return;
    }

    if (this.props.site.wechatEnv === 'openPlatform') {
      if (isWeiXin()) {
        const redirectEncodeUrl = encodeURIComponent(`https://${window.location.host}/user/wx-auth`);
        window.location.href = `https://${window.location.host}/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
        return;
      }
      this.props.router.replace('/user/wx-login');
      return;
    }

    if (this.props.site.isSmsOpen) {
      this.props.router.replace('/user/phone-login');
      return;
    }

    // 跳转状态页
    if (
      this.props.commonLogin.statusCode === BANNED_USER
      || this.props.commonLogin.statusCode === REVIEWING
      || this.props.commonLogin.statusCode === REVIEW_REJECT
    ) {
      const { statusCode, statusMsg } = this.props.commonLogin;
      this.props.commonLogin.setStatusMessage(statusCode);
      this.props.router.push(`/user/status?statusCode=${statusCode}&statusMsg=${statusMsg}`);
      return;
    }

    this.props.router.replace('/user/username-login');
    return;
  }

  render() {
    return null;
  }
}

export default withRouter(Login);
