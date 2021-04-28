import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import isWeiXin from '@common/utils/is-weixin';
import '@discuzq/design/dist/styles/index.scss';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';

@inject('site')
@inject('commonLogin')
@observer
class Login extends React.Component {
  componentDidMount() {
    if (this.props.site.wechatEnv === 'miniProgram') {
      if (isWeiXin()) {
        const redirectEncodeUrl = encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-auth`);
        window.location.href = `https://discuzv3-dev.dnspod.dev/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
        return;
      }
      this.props.router.replace('/user/wx-login');
      return;
    }

    if (this.props.site.wechatEnv === 'openPlatform') {
      if (isWeiXin()) {
        const redirectEncodeUrl = encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-auth`);
        window.location.href = `https://discuzv3-dev.dnspod.dev/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
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
