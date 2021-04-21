import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import '@discuzq/design/dist/styles/index.scss';
import { BAND_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/common-login-store';

@inject('site')
@inject('commonLogin')
@observer
class Login extends React.Component {
  componentDidMount() {
    if (this.props.site.wechatEnv === 'miniProgram') {
      this.props.router.replace('/user/wx-login');
      return;
    }

    if (this.props.site.wechatEnv === 'openPlatform') {
      this.props.router.replace('/user/wx-login');
      return;
    }

    if (this.props.site.isSmsOpen) {
      this.props.router.replace('/user/phone-login');
      return;
    }

    // 跳转状态页
    if (
      this.props.site.statusCode === BAND_USER
      || this.props.site.statusCode === REVIEWING
      || this.props.site.statusCode === REVIEW_REJECT
    ) {
      this.props.router.push('/user/status');
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
